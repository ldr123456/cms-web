<template>
  <div>
    <el-dialog v-model="props.visible" title="" width="50%" :before-close="cancelDialog">
      <el-button type="primary" @click="editDictItemVisible('add')">添加</el-button>
      <el-table border :data="tableData">
        <!-- 选择框，标题，发布时间，状态 -->
        <el-table-column prop="label" label="名称" min-width="200" />
        <el-table-column prop="value" label="字典值" min-width="200" />
        <el-table-column prop="desc" label="操作" min-width="100">
          <template #default="{ row }">
            <el-button icon="EditPen" @click="editDictItemVisible('edit', row)" circle />
            <el-button icon="Delete" @click="delDictItem(row.ID)" circle />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      title="添加字典项"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="label">
          <el-input v-model="formData.label" placeholder="请输入字典项名称"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model.number="formData.value" placeholder="请输入字典值"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="editDictItem"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import {
  findSysDataDictionaryDetail,
  createSysDataDictionaryDetail,
  updateSysDataDictionaryDetail,
  deleteSysDataDictionaryDetail,
} from "@/api/sysDataDictionary.js";
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["changeVisible"]);
const dictDataId = ref(0);
const tableData = ref([]);
// 编辑字典项弹窗显隐
const dialogType = ref("");
const dialogVisible = ref(false);
const formRef = ref(null);
const formData = ref({
  value: "",
  status: true,
  sort: 0,
  label: "",
  sysDataDictionaryID: 1,
});
const rules = reactive({
  label: [{ required: true, message: "请输入字典项名称", trigger: "blur" }],
  value: [
    { required: true, message: "请输入字典值", trigger: "blur" },
    { type: "number", message: "请输入数字", trigger: "blur" },
  ],
});
const initTable = async (id) => {
  dictDataId.value = id;
  console.log(dictDataId.value);
  const { data } = await findSysDataDictionaryDetail({
    sysDataDictionaryID: id,
  });
  tableData.value = data.reSysDataDictionaryDetail;
};
// 显示编辑弹窗
const editDictItemVisible = async (type, row) => {
  dialogType.value = type;
  dialogVisible.value = true;
  console.log(row);
  if (type === "edit") {
    formData.value = row;
  }
};
// 编辑字典项
const editDictItem = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (dialogType.value === "add") {
        formData.value.sort = tableData.value.length + 1;
        formData.value.sysDataDictionaryID = dictDataId.value;
        var res = await createSysDataDictionaryDetail(formData.value);
      } else if (dialogType.value === "edit") {
        var res = await updateSysDataDictionaryDetail(formData.value);
      }
      if (res.code == 0) {
        handleClose();
        initTable(dictDataId.value);
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
const handleClose = () => {
  dialogVisible.value = false;
  formData.value = {
    value: "",
    status: true,
    sort: 0,
    label: "",
    sysDataDictionaryID: 0,
  };
};
// 删除字典项
const delDictItem = async (id) => {
  const res = await deleteSysDataDictionaryDetail({ ID: id });
  console.log(res);
  if (res.code === 0) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
  }
  initTable(dictDataId.value);
};
// 关闭窗口
const cancelDialog = () => {
  tableData.value = []
  emit("changeVisible", { visible: false });
};
// 暴露方法
defineExpose({
  initTable,
});
</script>

<style lang="scss" scoped></style>
