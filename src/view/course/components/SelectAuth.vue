<template>
  <el-card class="auth">
    <h3>权限配置</h3>

    <el-radio-group v-model="authId" @change="handleRadioChange">
      <el-radio :label="1" size="large">完全公开</el-radio>
      <el-radio :label="2" size="large">指定部门</el-radio>
      <el-radio :label="3" size="large">指定人员</el-radio>
    </el-radio-group>
    <div class="all" v-if="authId === 1">
      <el-alert title="开放的,任何人都可以参与学习！" type="warning" />
    </div>
    <div class="department" v-if="authId === 2">
      <el-tree
        :data="departmentData"
        show-checkbox
        :check-strictly="true"
        default-expand-all
        @check="checkChange"
        :default-checked-keys="checkedArray"
      ></el-tree>
    </div>
    <div class="personnel" v-if="authId === 3">
      <div class="opergroup">
        <el-button type="primary" icon="plus" @click="addUser">
          添加
        </el-button>
        <el-button type="danger" :disabled="disabled" @click="deleteUser">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-input placeholder="搜索姓名" v-model="select.name" />
      </div>
      <div class="table">
        <el-table
          border
          style="width: 100%"
          :data="selectData"
          @selection-change="handleSelectionChange"
          header-row-class-name="header-row"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="ID" label="用户ID" align="center" />
          <el-table-column prop="nickName" label="用户名" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="mobile" label="手机号码" align="center" />
        </el-table>
        <el-pagination
          :current-page="select.page"
          :page-size="select.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :background="true"
          :total="selectUserIDs.length"
          @current-change="selectCurrentChange"
          @size-change="selectSizeChange"
        />
      </div>
    </div>
  </el-card>
  <el-dialog
    v-model="dialogTableVisible"
    title="选择用户"
    destroy-on-close
    width="60%"
    class="dialog"
  >
    <div class="opergroup">
      <el-tree-select
        v-model="state.paramData.department_id"
        :data="departmentData"
        :render-after-expand="false"
        default-expand-all
        clearable
      />
      <el-input
        v-model="state.paramData.name"
        placeholder="姓名"
        class="name"
      />
      <el-button type="primary" size="small" @click="confirmSelect"
        >确认{{ state.multipleSelectionAll.length }}项</el-button
      >
    </div>
    <el-table
      header-row-class-name="header-row"
      style="width: 100%"
      border
      :data="state.usersData"
      align="center"
      @selection-change="userSelectionChange"
      ref="multipleTable"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" />
      <el-table-column property="nickName" label="用户名" align="center" />
      <el-table-column property="name" label="姓名" align="center" />
      <el-table-column property="mobile" label="手机号" align="center" />
      <el-table-column property="email" label="邮箱" align="center" />
    </el-table>
    <el-pagination
      :current-page="state.paramData.page"
      :page-size="state.paramData.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :background="true"
      :total="state.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getDepartmentList } from "@/api/department.js";
import { Delete } from "@element-plus/icons-vue";
import { getUserList, getSelectUserList } from "@/api/course.js";
const authId = ref(1);
const handleRadioChange = (label) => {
  authId.value = label;
};
const props = defineProps(["isAdd", "selectAuth"]);
onMounted(() => {
  getDepartments();
});
watch(props, () => {
  // 修改课程
  if (!props.isAdd) {
    authId.value = props.selectAuth.authId;
    checkedArray.value = props.selectAuth.checkedArray;
    selectUserIDs.value = props.selectAuth.selectData;
    if (authId.value === 3) {
      select.value.select_id_list = props.selectAuth.selectData;
    }
  }
});
//部门开放
//获取部门信息
const departmentData = reactive([]);
const getDepartments = async () => {
  const {
    data: { list },
  } = await getDepartmentList();
  getDepartmentData(list, departmentData);
};
const getDepartmentData = (list, departmentData) => {
  list &&
    list.forEach((item) => {
      if (item.children && item.children.length !== 0) {
        const option = {
          label: item.name,
          checked: false,
          ID: item.ID,
          value: item.ID,
          children: [],
        };
        getDepartmentData(item.children, option.children);
        departmentData.push(option);
      } else {
        const option = {
          label: item.name,
          checked: false,
          value: item.ID,
          ID: item.ID,
        };
        departmentData.push(option);
      }
    });
};
//获取选中的部门数据
const checkedArray = ref([]);
const checkChange = (checked, checkArray) => {
  checkedArray.value = checkArray.checkedNodes;
};
//指定人员
const selectData = ref([]); //被选择用户
const dialogTableVisible = ref(false);
const disabled = ref(true);
const selectUserIDs = ref([]);
const select = ref({
  page: 1,
  pageSize: 10,
  name: "",
  select_id_list: [],
});
const selectUserMessage = async () => {
  const {
    data: { list },
  } = await getSelectUserList(select.value);
  selectData.value = list;
};
watch(select.value, () => {
  selectUserMessage();
});
const addUser = () => {
  dialogTableVisible.value = true;
  state.multipleSelectionIds = [];
  state.multipleSelectionAll = [];
  state.paramData = {
    page: 1,
    pageSize: 10,
    department_id: "",
    name: "",
    omit_id_list: selectUserIDs,
  };
  getUserMessage();
};
//删除选中用户
const selectedList = ref([]);
const deleteUser = () => {
  const userids = [];
  selectedList.value.forEach((item) => {
    userids.push(item.ID);
  });
  selectUserIDs.value = selectUserIDs.value.filter((item) => {
    if (!userids.includes(item)) {
      return item;
    }
  });
  select.value.select_id_list = selectUserIDs;
};
const handleSelectionChange = (selectList) => {
  if (selectList.length !== 0) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
  selectedList.value = [...selectList];
};
const selectCurrentChange = (val) => {
  select.value.page = val;
};
const selectSizeChange = (val) => {
  select.value.pageSize = val;
};
//获取用户信息
const state = reactive({
  paramData: {
    page: 1,
    pageSize: 10,
    department_id: "",
    name: "",
    omit_id_list: [],
  },
  usersData: [],
  multipleSelectionIds: [], //当前选中的数据的ID
  multipleSelectionAll: [],
  total: 0,
});
watch(
  () => state.paramData,
  () => {
    getUserMessage();
    reserveSelection();
  },
  { deep: true }
);
const getUserMessage = async () => {
  const {
    data: { list, total },
  } = await getUserList(state.paramData);
  state.total = total;
  state.usersData = list;
};
const userSelectionChange = (values) => {
  state.multipleSelectionIds = values.map((item) => {
    return item.ID;
  });
  state.multipleSelectionAll = [...values];
};
//确认用户
const confirmSelect = () => {
  dialogTableVisible.value = false;
  selectUserIDs.value = [...state.multipleSelectionIds, ...selectUserIDs.value];
  select.value.select_id_list = selectUserIDs.value;
};
//用户数据反显
const multipleTable = ref();
const reserveSelection = () => {
  if (state.multipleSelectionAll.length !== 0) {
    state.multipleSelectionAll.forEach((item) => {
      setTimeout(() => {
        multipleTable.value.toggleRowSelection(item, true); //让页面显示选中的数据
      }, 0);
    });
  }
};
//指定key值,数据更新之后保留之前选中的数据
const getRowKeys = (row) => {
  return row.ID;
};
const handleCurrentChange = (val) => {
  state.paramData.page = val;
};
const handleSizeChange = (val) => {
  state.paramData.pageSize = val;
};

defineExpose({
  authId,
  checkedArray,
  selectUserIDs,
});
</script>

<style lang="scss" scoped>
.auth {
  margin-top: 40px !important;
  box-sizing: border-box;
  .all,
  .department,
  .personnel {
    margin-top: 10px;
  }
  .personnel {
    .opergroup {
      display: flex;
      .el-input {
        width: 300px;
        margin-left: 10px;
      }
    }
    .table {
      margin-top: 10px;
    }
  }
}
.dialog {
  overflow: hidden;
  .opergroup {
    display: flex;
    margin-bottom: 10px;
    .name {
      margin-left: 10px;
      margin-right: 10px;
    }
    .el-input {
      width: 200px;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.header-row .cell {
  font-weight: 600;
}
</style>
