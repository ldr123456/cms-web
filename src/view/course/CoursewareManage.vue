<template>
  <el-card>
    <div class="inputBox">
      <el-select
        placeholder="课件类型"
        v-model="typeValue"
        clearable
        @change="onTypeChange"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-cascader
        filterable
        v-model="cateValue"
        placeholder="课件分类"
        :options="WareCate"
        :show-all-levels="false"
        @change="onCateSelect"
        :props="{ multiple: false, checkStrictly: true, emitPath: false }"
        clearable
      />
      <el-input
        placeholder="搜索课件名称"
        v-model="inputValue"
        @input="handleInput"
        size="large"
      ></el-input>
    </div>
    <div class="buttonBox">
      <el-button size="small" type="primary" icon="plus" @click="addWare">
        添加
      </el-button>
      <el-button
        type="warning"
        @click="onEditClick(currentSelect[currentSelect.length - 1])"
        :disabled="disabled"
      >
        <el-icon><EditPen /></el-icon>
        修改
      </el-button>
      <el-button type="danger" @click="onDeleClick" :disabled="disabled">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="CoursewareList"
      style="width: 100%"
      @selection-change="selectChange"
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        prop="name"
        label="课程名称"
        min-width="200"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <div class="wareName" @click="onEditClick(scope.row)">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="课件类型" align="center" />
      <el-table-column prop="cate" label="课程类目" align="center" />
      <el-table-column prop="size" label="文件大小" align="center" />
      <el-table-column prop="duration" label="课件时长" align="center" />
      <el-table-column prop="user_name" label="创建人" align="center" />
      <el-table-column prop="CreatedAt" label="创建时间" align="center">
        <template #default="{ row }">
          {{ $filters.dateFilter(row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-link target="_blank" type="primary" @click="preview(row)"
            ><el-icon><View /></el-icon>&nbsp;在线预览</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <!--增加弹窗-->
    <el-dialog
      v-model="centerDialogVisible"
      :title="isAdd ? '添加课件' : '修改课件'"
      :before-close="closeDialog"
      destroy-on-close
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="80px"
        ref="ruleFormRef"
      >
        <el-form-item label="课件类型" prop="lessonWareTypeId">
          <el-select v-model="form.lessonWareTypeId" @change="typeChange">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课件名称" prop="name">
          <el-input v-model="form.name" width="300px"></el-input>
        </el-form-item>
        <el-form-item label="课件分类" prop="lessonWareCateId">
          <el-cascader
            v-model="form.lessonWareCateId"
            placeholder="课件分类"
            :options="WareCate"
            :show-all-levels="false"
            @change="onCateChange"
            :props="{ multiple: false, checkStrictly: true, emitPath: false }"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="上传文件"
          prop="exa_file_upload_and_download_id_list"
          v-if="form.lessonWareTypeId"
        >
          <div class="upload">
            <el-upload
              v-if="isAudio"
              :file-list="file_list1"
              class="upload-demo"
              drag
              multiple
              action="http://59.110.218.15:8888/api/fileUploadAndDownload/upload"
              :headers="{
                'x-token': token,
              }"
              :on-success="uploadSuccess"
              accept=".pdf"
              :replace="true"
              ref="upload"
              :on-change="onChange"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处,或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">PDF文件可以直接在线预览</div>
              </template>
            </el-upload>
            <el-upload
              :file-list="file_list"
              class="upload-demo"
              drag
              multiple
              action="http://59.110.218.15:8888/api/fileUploadAndDownload/upload"
              :headers="{
                'x-token': token,
              }"
              :on-success="uploadSuccess"
              :accept="uploadChange.type"
              :replace="true"
              ref="upload"
              :on-change="onChange"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处,或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  {{ uploadChange.tip }}
                </div>
              </template>
            </el-upload>
          </div>
        </el-form-item>
        <el-alert
          title="课件保存后，您可以从列表来预览它！"
          type="success"
          :closable="true"
        />
      </el-form>
      <template #footer>
        <div class="diaog-footer">
          <el-button size="small" @click="closeAddUserDialog">取消</el-button>
          <el-button size="small" type="primary" @click="creatWare"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 在线预览 -->
    <CheckWare ref="checkWare" :currentPreview="currentPreview" />
    <!-- 分页 -->
    <div class="gva-pagination">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :background="true"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  getCoursewareList,
  getCoursewareflietypeclassification,
  getCoursewarecategories,
  createLessonWare,
  modifyLessonWare,
  deleteLessonWare,
} from "@/api/course.js";
import CheckWare from "@/components/checkware/CheckWare.vue";
import { View } from "@element-plus/icons-vue";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { ElMessage } from "element-plus";
// import pdfjsLib from "pdfjs-dist/webpack";
// import { getDocuments } from "/public/pdfjs/build/pdf.js";
const isAdd = ref(true);
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          ID: item.ID,
          label: item.label,
          value: item.ID,
          children: [],
        };
        setAuthorityOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          ID: item.ID,
          label: item.label,
          value: item.ID,
        };
        optionsData.push(option);
      }
    });
};
onMounted(() => {
  getAllCourseware();
  getCategories();
  getClassification();
});
const closeAddUserDialog = () => {
  centerDialogVisible.value = false;
  form.value = {
    lessonWareTypeId: "",
    name: "",
    lessonWareCateId: "",
    exa_file_upload_and_download_id_list: [],
  };
};

const closeDialog = () => {
  centerDialogVisible.value = false;
  form.value = {
    lessonWareTypeId: "",
    name: "",
    lessonWareCateId: "",
    exa_file_upload_and_download_id_list: [],
  };
};
//点击删除
const onDeleClick = async () => {
  var ids = [];
  currentSelect.forEach((item) => {
    ids.push(item.ID);
  });
  const { code } = await deleteLessonWare({ lessonWareIds: ids });
  if (code === 0) {
    ElMessage.success("删除成功");
  }
  getAllCourseware();
};

const token = localStorage.getItem("token");
//定义读取课件类目列表数组
const WareCate = ref([]);
//定义读取课件文件类型分类数组
const WareType = ref([]);
//默认不显示添加页面
const centerDialogVisible = ref(false);
// 搜索框相关
const typeValue = ref(""); //ref("")字符串
const typeOptions = ref([]); //ref([])数组
const cateValue = ref("");
const cateOptions = ref([]);
// 输入框内容
const inputValue = ref("");
//课件文件分类
const typeId = ref("");
//课件类型id
const lessonId = ref("");
//当前页数
const page = ref(1);
//每页数量
const pageSize = ref(10);
//课件总数
const total = ref(0);
//存储课件信息
const CoursewareList = ref([]);
//table实例
const multipleTableRef = ref(null);
//获取课件列表
const getAllCourseware = async () => {
  const { data } = await getCoursewareList({
    type: Number(typeId.value),
    name: inputValue.value,
    cate: Number(lessonId.value),
    page: page.value,
    pageSize: pageSize.value,
  });
  CoursewareList.value = data.list;
  total.value = data.total;
};
//自定义数组form
const form = ref({
  lessonWareTypeId: "",
  name: "",
  lessonWareCateId: "",
  exa_file_upload_and_download_id_list: [],
});
const checkArray = (rule, value, callback) => {
  // 验证上传文件
  if (isAudio.value) {
    if (value.length === 2) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  } else {
    if (value.length === 1) {
      callback();
    } else {
      callback(new Error(rule.message));
    }
  }
};
const rules = reactive({
  lessonWareTypeId: [
    { required: true, message: "请选择课件类型", trigger: "blur" },
  ],
  name: [{ required: true, message: "请输入课件名称", trigger: "blur" }],
  lessonWareCateId: [
    { required: true, message: "请输入课件分类", trigger: "blur" },
  ],
  exa_file_upload_and_download_id_list: [
    {
      required: true,
      message: "请选择上传的文件",
      trigger: "blur",
      validator: checkArray,
    },
  ],
});

//添加课件
const addWare = () => {
  centerDialogVisible.value = true;
  isAdd.value = true;
  form.value = {
    lessonWareTypeId: "",
    name: "",
    lessonWareCateId: "",
    exa_file_upload_and_download_id_list: [],
  };
};

//修改课件
const file_list = ref([]);
const file_list1 = ref([]);
//当为音频+pdf时，标识是pdf还是音频
const map = ref(new Map());
const onEditClick = (currentSelectWare) => {
  file_list.value = [];
  file_list1.value = [];
  centerDialogVisible.value = true;
  isAdd.value = false;
  isAudio.value = false;
  map.value.clear();
  form.value = {
    lessonWareTypeId: currentSelectWare.lesson_ware_type_id,
    name: currentSelectWare.name,
    lessonWareCateId: currentSelectWare.lesson_ware_cate_id,
    exa_file_upload_and_download_id_list: [],
  };
  if (currentSelectWare.lesson_ware_type_id === 4) {
    isAudio.value = true;
  }
  typeChange(currentSelectWare.lesson_ware_type_id);
  currentSelectWare.exa_file_upload_and_download_list.forEach((item) => {
    form.value.exa_file_upload_and_download_id_list.push(item.ID);
    if (isAudio.value) {
      //将类型和ID对应
      map.value.set(item.tag, item.ID);
      if (item.tag === "pdf") {
        file_list1.value = [
          {
            name: item.name,
            url: item.url,
          },
        ];
      } else {
        file_list.value = [
          {
            name: item.name,
            url: item.url,
          },
        ];
      }
    } else {
      file_list.value = [
        {
          name: item.name,
          url: item.url,
        },
      ];
    }
  });
};
//获取课件类目列表
const getCategories = async () => {
  const { data } = await getCoursewarecategories({});
  setAuthorityOptions(data, WareCate.value);
};
//课程类型改变
const uploadChange = reactive({
  tip: "包含doc,docx,xls,xlsx,ppt,pptx等Office类型文件",
  type: "",
});
//上传不同类型的文件
const isAudio = ref(false);
const typeChange = (val) => {
  switch (val) {
    case 1:
      isAudio.value = false;
      uploadChange.tip = "PDF文件可以直接在线预览";
      uploadChange.type = ".pdf";
      break;
    case 2:
      isAudio.value = false;
      uploadChange.type = ".mp4,.ogg,.flv,.avi,.wmv,.rmvb";
      uploadChange.tip =
        "视频文件,尽可能使用mp4格式兼容性较好，也支持.ogg,.flv,.avi,.wmv,.rmvb格式";
      break;
    case 3:
      isAudio.value = false;
      uploadChange.type = "doc,docx,xls,xlsx,ppt,pptx";
      uploadChange.tip = "包含doc,docx,xls,xlsx,ppt,pptx等Office类型文件";
      break;
    case 4:
      isAudio.value = true;
      uploadChange.type = "audio/*";
      uploadChange.tip = "音频文件";
  }
};
//创建课件
const ruleFormRef = ref(null);
const creatWare = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isAdd.value) {
        const { data } = await createLessonWare({
          ...form.value,
          lessonWareTypeId: Number(form.value.lessonWareTypeId),
        });
        ElMessage.success("创建成功");
      } else {
        //修改课件
        const res = await modifyLessonWare({
          ...form.value,
          id: currentSelect[currentSelect.length - 1].ID,
          duration: 0,
        });
        ElMessage.success("修改成功");
      }
      centerDialogVisible.value = false;
      getAllCourseware();
    }
  });
};

//获取课件文件类型分类
const getClassification = async () => {
  const { data } = await getCoursewareflietypeclassification({});
  data.forEach((element) => {
    typeOptions.value.push({
      label: element.label,
      value: element.value,
    });
  });
  WareType.value = data;
};

//处理数量变化
const handleSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  getAllCourseware();
};
//处理页数变化
const handleCurrentChange = (newpage) => {
  page.value = newpage;
  getAllCourseware();
};
//处理课件类型
const onTypeChange = (id) => {
  typeId.value = id;
  getAllCourseware();
};
//搜索课件输入框改变
const handleInput = () => {
  getAllCourseware();
};
//
const onCateChange = (id) => {
  form.value.lessonWareCateId = id;
  getAllCourseware();
};
const onCateSelect = (id) => {
  lessonId.value = id;
  getAllCourseware();
};
//修改按钮是否禁用
const disabled = ref(true);
//表格选中项变化
var currentSelect = reactive([]);
const selectChange = (val) => {
  currentSelect = [...val];
  if (currentSelect.length === 0) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }
};

// 上传成功的回调
const uploadSuccess = (val) => {
  const {
    data: { file },
  } = val;
  if (!isAudio.value) {
    //不是音频+pdf
    form.value.exa_file_upload_and_download_id_list = [file.ID];
  } else {
    //是音频+pdf
    if (map.value.has(file.tag)) {
      //替换
      var replaceID = map.value.get(file.tag);
      form.value.exa_file_upload_and_download_id_list.forEach((item, i) => {
        if (item === replaceID) {
          form.value.exa_file_upload_and_download_id_list[i] = file.ID;
        }
      });
    } else {
      form.value.exa_file_upload_and_download_id_list.push(file.ID);
    }
  }
};
const onChange = (file, fileList) => {
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
};

// 在线预览
const previewVisible = ref(false);
const currentPreview = ref({});
const checkWare = ref();
const preview = (row) => {
  previewVisible.value = true;
  currentPreview.value = { ...row };
  checkWare.value.openDialog();
};
</script>

<style lang="scss" scoped>
// @import "@/style/elementplus.css";
.el-card {
  margin: 125px 20px 20px 20px;
}
.wareName {
  color: #4290f7;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wareName:hover {
  color: #ff8000;
}
.inputBox {
  display: flex;
  margin-bottom: 15px;
  :deep(.el-select) {
    margin-right: 10px;
  }
  /* 样式穿透 */
  :deep(.el-input),
  :deep(.el-select) {
    width: 250px;
    height: 36px;
    line-height: 36px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.buttonBox {
  margin-bottom: 15px;
  .el-button {
    font-size: 13px;
  }
  .el-icon {
    margin-right: 5px;
  }
}
.el-tag {
  margin-right: 5px;
  cursor: pointer;
}
.upload-demo {
  display: inline;
}

.upload {
  display: flex;
  flex-direction: column;
}
.video-js {
  width: 100%;
  height: 600px;
}
</style>
