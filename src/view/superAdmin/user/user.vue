<template>
  <div>
    <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增用户</el-button>
      </div>
      <el-table :data="tableData" row-key="ID">
        <el-table-column align="left" label="头像" min-width="75">
          <template #default="scope">
            <CustomPic style="margin-top:8px" :pic-src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="ID" min-width="80" prop="ID" />
        <el-table-column align="left" label="用户名" min-width="100" prop="name" />
        <el-table-column align="left" label="昵称" min-width="100" prop="nickName" />
        <el-table-column align="left" label="手机号" min-width="180" prop="mobile" />
        <el-table-column align="left" label="邮箱" min-width="180" prop="email" />
        <el-table-column align="left" label="用户角色" min-width="300">
          <template #default="scope">
            <!-- <el-cascader v-model="scope.row.authorityIds" :options="authOptions" :show-all-levels="false" collapse-tags :props="{ multiple: true, checkStrictly: true, label: 'authorityName', value: 'authorityId', disabled: 'disabled', emitPath: false }" :clearable="false" @visible-change="(flag) => { changeAuthority(scope.row, flag, 0) }" @remove-tag="(removeAuth) => { changeAuthority(scope.row, false, removeAuth) }" /> -->
            <el-tooltip v-for="(item, index) in scope.row.dept_and_authority_list" :key="index" content="点击删除" placement="top">
              <el-button @click="deleteAuth(index)">{{ item.dept_and_authority_name }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left" label="启用" min-width="50">
          <template #default="scope">
            <el-switch v-model="scope.row.enable" inline-prompt :active-value="1" :inactive-value="2" @change="() => { switchEnable(scope.row) }" />
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="scope">
            <el-popover v-model="scope.row.visible" placement="top" width="160">
              <p>确定要删除此用户吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="primary" link @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteUserFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="primary" link icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
            <el-button type="primary" link icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="primary" link icon="magic-stick" size="small" @click="resetPasswordFunc(scope.row)">重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
      </div>
    </div>
    <el-dialog v-model="addUserDialog" custom-class="user-dialog" title="用户" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
          <el-form-item v-if="dialogFlag === 'add'" label="用户名" prop="userName">
            <el-input v-model="userInfo.userName" />
          </el-form-item>
          <el-form-item v-if="dialogFlag === 'add'" label="密码" prop="password">
            <el-input v-model="userInfo.password" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="userInfo.nickName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="选择部门" prop="departmentId">
            <el-cascader v-model="userInfo.departmentId" style="width:100%" :options="departOptions" :show-all-levels="false" :props="{ multiple: false, checkStrictly: true, label: 'departName', value: 'departmentId', disabled: 'disabled', emitPath: false }" :clearable="false" />
          </el-form-item>
          <el-form-item label="选择角色" prop="authorityId">
            <el-cascader v-model="userInfo.authorityId" style="width:100%" :options="authOptions" :show-all-levels="false" :props="{ multiple: false, checkStrictly: true, label: 'authorityName', value: 'authorityId', disabled: 'disabled', emitPath: false }" :clearable="false" />
          </el-form-item>
          <div class="userAuth">
            <span>已选角色: </span>
            <span v-if="authStrs.length === 0">暂无角色信息</span>
            <span v-else class="authBox">
              <!-- <el-button v-for="(item, index) in userInfo.authStrs" :key="index" @click="deleteAuth(index)">{{ item }}
              </el-button> -->
              <el-tooltip v-for="(item, index) in authStrs" :key="index" content="点击删除" placement="top">
                <el-button @click="deleteAuth(index)">{{ item }}</el-button>
              </el-tooltip>
            </span>
            <el-button @click="addAuth">添加角色</el-button>
          </div>

          <el-form-item label="启用" prop="disabled">
            <el-switch v-model="userInfo.enable" inline-prompt :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item label="头像" label-width="80px">
            <div style="display:inline-block" @click="openHeaderChange">
              <img v-if="userInfo.avatar" class="header-img-box" :src="(userInfo.avatar && userInfo.avatar.slice(0, 4) !== 'http') ? path + userInfo.avatar : userInfo.avatar">
              <div v-else class="header-img-box">从媒体库选择</div>
            </div>
          </el-form-item>

        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`avatar`" />
  </div>
</template>

<script>
export default {
  name: 'User',
} 
</script>

<script setup>
// import { ElMessage } from 'element-plus'
import {
  getUserList,
  setUserAuthorities,
  register,
  deleteUser
} from '@/api/user'
// 获取用户角色数据
import { getAuthorityList } from '@/api/authority'
// 获取部门数据
import { getDepartmentList } from '@/api/department'
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const path = ref(import.meta.env.VITE_BASE_API + '/')
// 初始化相关
// 递归初始化用户角色级联选择器数据
const setAuthorityOptions = (AuthorityData, optionsData, DepartData, DepartOption) => {
  AuthorityData &&
    AuthorityData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          authorityId: item.authorityId + " " + item.authorityName,
          authorityName: item.authorityName,
          children: []
        }
        setAuthorityOptions(item.children, option.children, null, null)
        optionsData.push(option)
      } else {
        const option = {
          authorityId: item.authorityId + " " + item.authorityName,
          authorityName: item.authorityName
        }
        optionsData.push(option)
      }
    })
  DepartData &&
    DepartData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          departmentId: item.ID + ' ' + item.name,
          departName: item.name,
          children: []
        }
        setAuthorityOptions(null, null, item.children, option.children)
        DepartOption.push(option)
      } else {
        const option = {
          departmentId: item.ID + ' ' + item.name,
          departName: item.name
        }
        DepartOption.push(option)
      }
    })
}

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async () => {
  const table = await getUserList({ page: page.value, pageSize: pageSize.value })
  // console.log(table.data.list)
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

watch(() => tableData.value, () => {
  setAuthorityIds()
})
// 初始化页面数据
const initPage = async () => {
  // 获取表格内容
  getTableData()
  // 新增用户中 获取用户角色信息
  const res = await getAuthorityList({ page: 1, pageSize: 999 })
  // console.log(res.data.list);
  const res2 = await getDepartmentList({ page: 1, pageSize: 10 })
  // console.log(res2.data.list);
  // 初始化用户角色数据
  setOptions(res.data.list, res2.data.list)
}

initPage()

const resetPasswordFunc = (row) => {
  ElMessageBox.confirm(
    '是否将此用户密码重置为123456?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await resetPassword({
      ID: row.ID,
    })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  })
}
const setAuthorityIds = () => {
  tableData.value && tableData.value.forEach((user) => {
    const authorityIds = user.authorities && user.authorities.map(i => {
      return i.authorityId
    })
    user.authorityIds = authorityIds
  })
}

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}
// 用户角色级联选择器 权限数据
const authOptions = ref([])
const departOptions = ref([])
const setOptions = (authData, departData) => {

  // 权限数据赋为空
  authOptions.value = []
  
  // 渲染权限数组
  setAuthorityOptions(authData, authOptions.value, null, null)

  // 部门数据赋值为空
  departOptions.value = []
  // 渲染部门数组
  setAuthorityOptions(null, null, departData, departOptions.value)
  // console.log(departData);
  // console.log(departOptions);
}

const deleteUserFunc = async (row) => {
  const res = await deleteUser({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗相关
const userInfo = ref({
  userName: '',
  password: '',
  nickName: '',
  avatar: '',
  authorityId: 0,
  // authorityIds: [],
  // departmentIds: [],
  departmentId: 0,
  // 用户对应的所有身份
  department_ids_and_authority_ids: [],
  enable: 1,
})
// 用户对应身份的字符串 用于展示
const authStrs = ref([]);
// 删除一个身份
const deleteAuth = (index) => {
  console.log(index);
  console.log(userInfo.value.department_ids_and_authority_ids);
  userInfo.value.department_ids_and_authority_ids.splice(index, 1);
  authStrs.value.splice(index, 1);
}
// 增加一个身份
const addAuth = () => {
  if (!userInfo.value.departmentId || !userInfo.value.authorityId) {
    ElMessage({
      message: '部门或角色不能为空.',
      type: 'warning',
    })
    return
  }
  const arr = [];
  userInfo.value.department_ids_and_authority_ids = []
  // 获取部门id
  arr.push(parseInt(userInfo.value.departmentId.split(' ')[0]));
  // 获取权限id
  arr.push(parseInt(userInfo.value.authorityId.split(' ')[0]));
  userInfo.value.department_ids_and_authority_ids.push(arr)
  // console.log(userInfo.value.department_ids_and_authority_ids);

  authStrs.value.push(userInfo.value.departmentId.split(' ')[1] + userInfo.value.authorityId.split(' ')[1])

  
  userInfo.value.departmentId = ''
  userInfo.value.authorityId = ''
  ElMessage({
    message: '添加角色成功.',
    type: 'success',
  })
}
// 部门值改变
// const selectDepart = (value) => {
//   console.log('我的部门id: ' + value);
//   console.log(userInfo.value.departmentId);
// }
// 角色值改变
// const selectAuth = (value) => {
//   console.log('我的部门id: ' + value);
//   console.log(userInfo.value.authorityId);
// }

// 判定规则
const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  authorityId: [
    { required: true, message: '请选择用户角色', trigger: 'blur' }
  ]
})
const userForm = ref(null)
const enterAddUserDialog = async () => {
  userInfo.value.departmentId = userInfo.value.department_ids_and_authority_ids[0][0]
  userInfo.value.authorityId = userInfo.value.department_ids_and_authority_ids[0][1]

  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...userInfo.value
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
          authStrs.value = [] // 清除所选部门角色
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setUserInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
          authStrs.value = [] // 清除所选部门角色
        }
      }
    }
  })
}

const addUserDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  userInfo.value.avatar = ''
  userInfo.value.authorityIds = []
  addUserDialog.value = false
  authStrs.value = [] // 清除所选部门角色
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const tempAuth = {}
const changeAuthority = async (row, flag, removeAuth) => {
  if (flag) {
    if (!removeAuth) {
      tempAuth[row.ID] = [...row.authorityIds]
    }
    return
  }
  await nextTick()
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds
  })
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '角色设置成功' })
  } else {
    if (!removeAuth) {
      row.authorityIds = [...tempAuth[row.ID]]
      delete tempAuth[row.ID]
    } else {
      row.authorityIds = [removeAuth, ...row.authorityIds]
    }
  }
}
// 打开编辑页面
const openEdit = (row) => {
  console.log(row);
  dialogFlag.value = 'edit'
  userInfo.value = JSON.parse(JSON.stringify(row))
  for(let i in row.authorityIds){
    authStrs.value.push(row.authorities[i].authorityName)
    // authStrs.value.push(row.departments[i].name + row.authorities[i].authorityName)
  }
  // console.log(authStrs.value);
  addUserDialog.value = true
}

const switchEnable = async (row) => {
  userInfo.value = JSON.parse(JSON.stringify(row))
  await nextTick()
  const req = {
    ...userInfo.value
  }
  const res = await setUserInfo(req)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: `${req.enable === 2 ? '禁用' : '启用'}成功` })
    await getTableData()
    userInfo.value.avatar = ''
    userInfo.value.authorityIds = []
  }
}

</script>

<style lang="scss">
.user-dialog {
  .header-img-box {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 200px;
    cursor: pointer;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.nickName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pointer {
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}

.userAuth {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;

  .authBox {
    flex: 1;
    padding: 0 12px;
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    margin-right: 10px;
  }

  .authBox::-webkit-scrollbar {
    // width: 10px;
    height: 5px; // 高度写不写，都不影响，因为会根据内容的长度自动计算
  }
}
</style>

