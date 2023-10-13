<template>
  <el-card>
    <div class="opergroup">
      <el-button type="primary" size="small" @click="addCatalog"
        >添加目录</el-button
      >
      <el-button type="warning" size="small" @click="addWare"
        >导入目录</el-button
      >
      <!-- <el-button type="danger" size="small">批量设置</el-button> -->
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        header-row-class-name="header-row"
        default-expand-all
      >
        <el-table-column type="expand">
          <template #default="scope">
            <div class="courses">
              <el-table
                :data="scope.row.children"
                border
                header-row-class-name="header-row"
              >
                <el-table-column
                  label="文件名称"
                  prop="name"
                  show-overflow-tooltip
                >
                  <template v-slot="scope">
                    <div class="name">
                      {{ scope.row.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="课件类型"
                  prop="lesson_ware_type_id"
                  align="center"
                >
                  <template v-slot="scope">
                    {{ getWareType(scope.row.lesson_ware_type_id) }}
                  </template>
                </el-table-column>
                <el-table-column label="要求时长" align="center">
                  <template v-slot="scope">
                    <span class="time"
                      ><el-input
                        type="text"
                        size="small"
                        v-model="scope.row.minute" /></span
                    >分<span class="time"
                      ><el-input type="text" v-model="scope.row.second" /></span
                    >秒
                  </template>
                </el-table-column>
                <el-table-column label="学完积分" prop="" align="center">
                  <el-input-number :step="1" :min="0" />
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template v-slot="wareScope">
                    <el-button
                      type="danger"
                      :icon="Delete"
                      circle
                      @click="deleteWare(scope.$index, wareScope.$index)"
                    />
                    <el-button
                      :icon="SortDown"
                      circle
                      @click="wareMoveDown(scope.$index, wareScope.$index)"
                    />
                    <el-button
                      :icon="SortUp"
                      circle
                      @click="wareMoveUp(scope.$index, wareScope.$index)"
                    />
                    <el-button
                      type="primary"
                      :icon="View"
                      circle
                      @click="preview(wareScope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="label">
          <template v-slot="scope">
            <el-input v-model="scope.row.label" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              type="primary"
              :icon="Plus"
              circle
              @click="chooseWare(scope.$index)"
            />
            <el-button
              :icon="Delete"
              circle
              @click="deleteCatalog(scope.$index)"
            />
            <el-button
              :icon="SortDown"
              circle
              @click="catalogMoveDown(scope.$index)"
            />
            <el-button
              :icon="SortUp"
              circle
              @click="catalogMoveUp(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加目录 -->
    <el-dialog
      v-model="cataDialogVisible"
      title="提示"
      width="25%"
      destroy-on-close
    >
      <span class="tip">请输入文件夹名称</span>
      <el-input v-model="label" ref="inputName" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cataDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 导入目录 -->
    <el-dialog v-model="wareDialogVisible" width="25%" destroy-on-close>
      <el-form>
        <el-form-item label="导入类目">
          <el-tree-select
            v-model="warecategorie"
            :data="wareCate"
            check-strictly
            :render-after-expand="true"
            clearable
            default-expand-all
          />
        </el-form-item>
        <el-form-item label="导入方式">
          <el-radio-group v-model="radio">
            <el-radio :label="1">下级目录及课件</el-radio>
            <el-radio :label="2">本目录及其课件</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmImport">
            确任导入
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加课件 -->
    <el-dialog
      v-model="dialogVisible"
      width="80%"
      destroy-on-close
      title="选择课件"
    >
      <div class="inputBox">
        <el-select placeholder="课件类型" v-model="wareSearch.type" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tree-select
          v-model="wareSearch.cate"
          :data="wareCate"
          check-strictly
          :render-after-expand="true"
          clearable
          default-expand-all
        />
        <el-input
          placeholder="搜索课件名称"
          v-model="wareSearch.name"
          size="large"
        ></el-input>
      </div>
      <el-table
        :data="waresData"
        border
        style="width: 100%"
        header-row-class-name="header-row"
        default-expand-all
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          label="课件名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        >
          <template v-slot="scope">
            <div class="wareName" @click="onEditClick(scope.row)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课件类目" align="center" prop="cate" />
        <el-table-column label="课件时长" align="center" prop="duration" />
        <el-table-column label="课件类型" align="center" prop="type" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddWare"> 确定 </el-button>
        </span>
      </template>
      <!-- 分页 -->
      <div class="gva-pagination">
        <el-pagination
          :current-page="wareSearch.page"
          :page-size="wareSearch.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :background="true"
          :total="waresTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- 课件预览 -->
    <CheckWare ref="checkWare" :currentPreview="currentPreview" />
  </el-card>
</template>

<script setup>
import { View, Delete, SortDown, SortUp, Plus } from "@element-plus/icons-vue";
import { ref, watch, onMounted } from "vue";
import {
  getCoursewarecategories,
  getCoursewareflietypeclassification,
  importWareList,
  getLessonWareList,
} from "@/api/course.js";
import CheckWare from "@/components/checkWare/CheckWare.vue";
const props = defineProps(["wareLists"]);
watch(props, () => {
  tableData.value = [...props.wareLists];
  console.log(props.wareLists);
});
//目录上下移动
const catalogMoveUp = (index) => {
  if (index === 0) {
    return;
  }
  const item = tableData.value.splice(index, 1)[0];
  tableData.value.splice(index - 1, 0, item);
};
const catalogMoveDown = (index) => {
  if (index === tableData.value.length - 1) {
    return;
  }
  const item = tableData.value.splice(index, 1)[0];
  tableData.value.splice(index + 1, 0, item);
};
//课件上下移动
const wareMoveUp = (catalogIndex, wareIndex) => {
  //catalogIndex 目录表格下标
  //wareIndex 课件表格下标
  if (wareIndex === 0) {
    return;
  }
  const item = tableData.value[catalogIndex].children.splice(wareIndex, 1)[0];
  tableData.value[catalogIndex].children.splice(wareIndex - 1, 0, item);
};
const wareMoveDown = (catalogIndex, wareIndex) => {
  if (wareIndex === tableData.value[catalogIndex].children.length - 1) {
    return;
  }
  const item = tableData.value[catalogIndex].children.splice(wareIndex, 1)[0];
  tableData.value[catalogIndex].children.splice(wareIndex + 1, 0, item);
};
//删除目录
const deleteCatalog = (index) => {
  tableData.value.splice(index, 1);
};
//删除课件
const deleteWare = (catalogIndex, wareIndex) => {
  tableData.value[catalogIndex].children.splice(wareIndex, 1);
};
// 添加课件
const selectWareList = ref([]); //多选列表
const waresData = ref([]);
const wareSearch = ref({
  type: "",
  name: "",
  cate: "",
  page: 1,
  pageSize: 10,
  omit_id_list: [],
});
const dialogVisible = ref(false);
const waresTotal = ref(0);
const getWareList = async () => {
  const {
    data: { list },
  } = await getLessonWareList({
    ...wareSearch.value,
    type: Number(wareSearch.value.type),
    cate: Number(wareSearch.value.cate),
  });
  waresData.value = list;
  waresTotal.value = list.length;
};
watch(wareSearch.value, () => {
  getWareList();
});
const currentIndex = ref(0); //当前选择的目录index
const chooseWare = async (index) => {
  currentIndex.value = index; //到这，多选确定和多选取消
  dialogVisible.value = true;
  getClassification();
  wareSearch.value.omit_id_list = [];
  tableData.value[index].children.forEach((item) => {
    wareSearch.value.omit_id_list.push(item.ID);
  });
  getWareList();
};
//确认添加
const confirmAddWare = () => {
  selectWareList.value = selectWareList.value.map((value) => {
    return {
      ...value,
      minute: value.duration / 60,
      second: value.duration % 60,
    };
  });
  tableData.value[currentIndex.value].children = [
    ...selectWareList.value,
    ...tableData.value[currentIndex.value].children,
  ];
  dialogVisible.value = false;
};
// 多选
const selectChange = (val) => {
  selectWareList.value = [...val];
};
const handleCurrentChange = (val) => {
  wareSearch.value.page = val;
};
const handleSizeChange = (val) => {
  wareSearch.value.pageSize = val;
};
//获取课件文件类型分类
const typeOptions = ref([]);
const getClassification = async () => {
  typeOptions.value = [];
  const { data } = await getCoursewareflietypeclassification();
  data.forEach((element) => {
    typeOptions.value.push({
      label: element.label,
      value: element.value,
    });
  });
  // WareType.value = data;
};
//添加目录
const cataDialogVisible = ref(false);
const inputName = ref();
const label = ref("");
const addCatalog = () => {
  label.value = "";
  cataDialogVisible.value = true;
  setTimeout(() => {
    inputName.value && inputName.value.focus();
  }, 0);
};
const confirmAdd = () => {
  cataDialogVisible.value = false;
  const file = {
    label: label.value,
    children: [],
  };
  tableData.value.unshift(file);
};

//导入目录
//获取课程分类
const wareDialogVisible = ref(false);
const wareCate = ref([]); //课程分类数据
const radio = ref(-1);

const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach((item) => {
      if (item.children && item.children.length !== 0) {
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
          children: [],
        };
        optionsData.push(option);
      }
    });
};
const addWare = async () => {
  warecategorie.value = "";
  wareCate.value = [];
  radio.value = -1;
  wareDialogVisible.value = true;
  const { data } = await getCoursewarecategories({});
  setAuthorityOptions(data, wareCate.value);
};
const warecategorie = ref("");
const confirmImport = async () => {
  wareDialogVisible.value = false;
  if (
    (radio.value !== -1 && !warecategorie.value) ||
    (radio.value === -1 && !warecategorie.value)
  ) {
    return;
  }
  if (radio.value === -1 && warecategorie.value) {
    radio.value = 2;
  }
  const { data } = await importWareList({
    cateId: warecategorie.value,
    lessonWareImportMethod: radio.value,
  });
  // 下级目录及课件
  if (radio.value === 1) {
    data.forEach((item) => {
      item.lesson_ware_list = item.lesson_ware_list.map((value) => {
        return {
          ...value,
          minute: value.duration / 60,
          second: value.duration % 60,
        };
      });
      const file = {
        label: item.cate_detail,
        children: [...item.lesson_ware_list],
      };
      tableData.value.unshift(file);
    });
  } else {
    // 本目录及其课件
    data[0].lesson_ware_list = data[0].lesson_ware_list.map((value) => {
      return {
        ...value,
        minute: value.duration / 60,
        second: value.duration % 60,
      };
    });
    const file = {
      label: data[0].cate_detail,
      children: [...data[0].lesson_ware_list],
    };
    tableData.value.unshift(file);
  }
};
// 课件预览
const checkWare = ref();
const currentPreview = ref({});
const preview = (row) => {
  currentPreview.value = { ...row };
  checkWare.value.openDialog();
};
const tableData = ref([]);
// 课件类型
const getWareType = (id) => {
  switch (id) {
    case 1:
      return "pdf文件";
    case 2:
      return "视频文件";
    case 3:
      return "Office文件";
    case 4:
      return "音频文件(mp3+pdf)";
  }
};
defineExpose({
  tableData,
});
</script>

<style lang="scss" scoped>
.content {
  margin-top: 10px;
  .courses {
    margin: 10px;
    .time {
      display: inline-block;
      width: 50px;
    }
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.tip {
  display: block;
  margin-bottom: 20px;
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
.wareName {
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style></style>
