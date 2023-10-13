// 数据字典
<template>
  <div>
    <el-card>
      <div style="margin-bottom: 20px">
        <el-button type="primary" icon="Plus" @click="editDictVisible('add')">
          添加
        </el-button>
        <el-button
          type="warning"
          icon="EditPen"
          :disabled="isDisable"
          @click="editDictVisible('edit')"
        >
          修改
        </el-button>
        <el-button type="danger" icon="Delete" :disabled="isDisable" @click="delDict">
          删除
        </el-button>
        <el-input
          v-model="dictName"
          placeholder="名称(中)"
          class="search"
          @input="inputChange"
        />
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择框，标题，发布时间，状态 -->
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="字典名(中)" min-width="100">
          <template #default="{ row }">
            <a href="javascript:;" class="d-link" @click="editDictVisible('edit', row)">
              {{ row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="字典名(英)" min-width="100" />
        <el-table-column prop="desc" label="描述" min-width="200" />
        <el-table-column label="配置" min-width="100">
          <template #default="{ row }">
            <el-button type="primary" icon="setting" @click="editDictItem(row.ID)" text>
              配置项
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="editDialog"
      title="添加数据字典"
      width="30%"
      :before-close="cancelDialog"
    >
      <el-form
        ref="editFormRef"
        :model="editDiaData"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item label="名称(中)" prop="name">
          <el-input v-model="editDiaData.name" placeholder="请输入字典中文名"></el-input>
        </el-form-item>
        <el-form-item label="名称(英)" prop="type">
          <el-input v-model="editDiaData.type" placeholder="请输入字典英文名"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editDiaData.desc" placeholder="请输入字典描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="editDict"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <dictSortDialog
      ref="itemDialog"
      :visible="dictItemVisible"
      @changeVisible="changeVisible"
    ></dictSortDialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import dictSortDialog from "@/view/systemSet/component/dictSortDialog.vue";
import {
  createSysSortDictionary,
  deleteSysSortDictionary,
  updateSysDictionary,
  getSysSortDictionaryList,
} from "@/api/sysSortDictionary.js";
// 搜索框
const dictName = ref("");
// 字典弹窗
const editDialog = ref(false);
const editFormRef = ref();
const editDiaData = ref({
  name: "",
  type: "",
  desc: "",
  status: true,
});
const addFormRules = reactive({
  name: [{ required: true, message: "请输入字典中文名", trigger: "blur" }],
  type: [{ required: true, message: "请输入字典英文名", trigger: "blur" }],
  desc: [{ required: true, message: "请输入字典描述", trigger: "blur" }],
});
// 弹窗属性
const dialogType = ref();
// 字典项弹窗
const itemDialog = ref(null);
const dictItemVisible = ref(false);

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const initTable = async () => {
  const { data } = await getSysSortDictionaryList({
    page: page.value,
    pageSize: pageSize.value,
  });
  tableData.value = data.list;
  page.value = data.page;
  pageSize.value = data.pageSize;
  total.value = data.total;
};
initTable();
let multipleSelection = reactive([]);
const isDisable = ref(true);
// 监听表格状态改变
const handleSelectionChange = (val) => {
  multipleSelection = val;
  if (val.length === 1) isDisable.value = false;
  else isDisable.value = true;
};
// 显示编辑弹窗
const editDictVisible = (type, row) => {
  dialogType.value = type;
  editDialog.value = true;
  if (type === "edit" && !row) {
    editDiaData.value = multipleSelection[0];
  }else if(type === "edit" && row){
    editDiaData.value = row
  }
};
// 提交弹窗表格信息
const editDict = async () => {
  if (!editFormRef.value) return;
  await editFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (dialogType.value === "add") {
        var res = await createSysSortDictionary(editDiaData.value);
      } else if (dialogType.value === "edit") {
        var res = await updateSysDictionary(editDiaData.value);
      }
      if (res.code == 0) {
        cancelDialog();
        console.log(res);
        ElMessage({
          message: res.msg,
          type: "success",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 关闭字典弹窗
const cancelDialog = () => {
  initTable();
  editDialog.value = false;
  editDiaData.value = ref({
    name: "",
    type: "",
    desc: "",
    status: true,
  });
};
// 删除选中项
const delDict = () => {
  ElMessageBox.confirm(
    `此操作将永久删除字典 ${multipleSelection[0].name} , 是否继续?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const res = await deleteSysSortDictionary({
        id: multipleSelection[0].ID,
      });
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--;
        }
        initTable();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};
// 编辑字典项
const editDictItem = (id) => {
  dictItemVisible.value = true;
  // 子组件初始化方法
  itemDialog.value.initTable(id);
};
const changeVisible = (val) => {
  dictItemVisible.value = val.visible;
};
// 监听输入框改变
const inputChange = (val) => {
  initTable();
};
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val; // 每页显示个数
  initTable();
};
const handleCurrentChange = (val) => {
  page.value = val; // 当前页
  initTable();
};
</script>

<style lang="scss" scoped>
@import "@/style/element_visiable.scss";
.search {
  margin-left: 10px;
  display: inline;
}
.d-link {
  color: #1890ff;
  font-weight: 700;
}
.d-link:hover {
  color: #ff8000;
}
</style>
