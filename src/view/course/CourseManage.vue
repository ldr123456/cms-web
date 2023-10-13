<!-- 课程管理 -->
<template>
  <el-card>
    <div class="inputBox">
      <el-select
        v-model="searchData.compulsoryTypeId"
        placeholder="请选择"
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
        v-model="searchData.lessonTypeId"
        placeholder="请选择课程"
        :options="WareCate"
        :show-all-levels="false"
        @change="onLessonChange"
        :props="{ multiple: false, checkStrictly: true, emitPath: false }"
        clearable
      />
      <el-input placeholder="搜索课程" v-model="searchData.name"></el-input>
    </div>
    <div class="buttonBox">
      <el-button type="primary" @click="onAddClick">
        <el-icon><Plus /></el-icon>
        添加
      </el-button>
      <el-button type="warning" @click="onEditClick" :disabled="disabled">
        <el-icon><EditPen /></el-icon>
        修改
      </el-button>
      <el-button type="danger" @click="onDeleClick">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="courseList"
      style="width: 100%"
      @selection-change="selectChange"
      border
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="name" label="课程名称" show-overflow-tooltip>
        <template v-slot="scope">
          <div class="courseName" @click="onEditClick(scope.row)">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="compulsoryTypeDetail" label="分类" />
      <el-table-column prop="permissionDetail" label="开放类型" />
      <el-table-column prop="price" label="售价" />
      <el-table-column prop="studyHour" label="课时" />
      <el-table-column label="创建时间" width="250">
        <template #default="{ row }">
          {{ $filters.dateFilter(row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="200">
        <!-- <template> -->
        <el-tag>统计分析</el-tag>
        <el-tag>分享链接</el-tag>
        <!-- </template> -->
      </el-table-column>
    </el-table>
    <div class="gva-pagination">
      <el-pagination
        v-model:current-page="searchData.page"
        v-model:page-size="searchData.pageSize"
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
import { onMounted, ref, reactive, watch } from "vue";
import {
  getCourseList,
  getCompulsoryTypeList,
  getLessonTypeList,
  deleteLesson,
} from "@/api/course.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

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

// 搜索框相关
const typeOptions = ref([]);
const searchData = reactive({
  page: 1,
  pageSize: 10,
  compulsoryTypeId: "",
  lessonTypeId: "",
  name: "",
});
// 课程总数
const total = ref(0);
// 存储课程信息
const courseList = ref([]);
// table实例
const multipleTableRef = ref(null);
// 获取课程信息
const getAllCourse = async () => {
  const { data } = await getCourseList(searchData);
  courseList.value = data.LessonList;
  total.value = data.Total;
  ElMessage.success("数据获取成功");
};
const WareCate = ref([]);
// 获取课程分类
const categoryList = ref([]);
const getAllLesson = async () => {
  const { data } = await getLessonTypeList({
    ID: 29,
  });
  categoryList.value = data.sysDictionary.sysSortDictionaryDetails;
  setAuthorityOptions(categoryList.value, WareCate.value);
};

// 获取课程选修类型
const getAllType = async () => {
  const { data } = await getCompulsoryTypeList();
  typeOptions.value = data.map((item) => {
    return {
      label: item.label,
      value: item.ID,
    };
  });
};

onMounted(() => {
  getAllLesson();
  getAllType();
  getAllCourse();
});
// 处理数量变化
const handleSizeChange = (newPageSize) => {
  searchData.pageSize = newPageSize;
};
// 处理页数变化
const handleCurrentChange = (newpage) => {
  searchData.page = newpage;
};

// 处理选择类型
const onTypeChange = (id) => {
  searchData.compulsoryTypeId = id;
};
// 处理选择分类
const onLessonChange = (id) => {
  searchData.lessonTypeId = id;
};

watch(searchData, () => {
  getAllCourse();
});
const router = useRouter();
// 点击添加
const onAddClick = () => {
  router.push({
    name: "addcourse",
  });
};
// 点击修改
const onEditClick = (row) => {
  if (row.ID) {
    LessonID.value = row.ID;
    console.log(row);
  }
  const data = multipleTableRef.value.getSelectionRows();
  router.push(`/layout/course/editcourse/${LessonID.value}`);
};
const LessonID = ref("");
// 点击删除
const onDeleClick = async () => {
  var ids = [];
  currentSelect.value.forEach((item) => {
    ids.push(item.ID);
  });
  const { code } = await deleteLesson({ ids: ids });
  getAllCourse();
  if (code === 0) {
    ElMessage.success("删除成功");
  }
};
// 修改按钮是否禁用
const disabled = ref(true);
// 表格选中项变化
const currentSelect = ref([]);
const selectChange = (val) => {
  currentSelect.value = [...val];
  if (currentSelect.length === 0) {
    disabled.value = true;
  } else {
    disabled.value = false;
    LessonID.value = val[val.length - 1].ID;
  }
};
</script>

<style lang="scss" scoped>
// @import "@/style/elementplus.css";
.el-card {
  margin: 125px 20px 20px 20px;
}
.courseName {
  color: #4290f7;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.courseName:hover {
  color: #ff8000;
}
.inputBox {
  margin-bottom: 15px;
  :deep(.el-select) {
    margin-right: 10px;
    // display: inline-block;
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
</style>
