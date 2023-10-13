<template>
  <div>
    <!-- 整个卡片页面 -->
    <el-card >
        <div>
            <!-- 添加的按钮，点击之后显示出添加的页面 -->
            <el-button type="primary"  @click="dialogTableVisible = true">添加</el-button>
            <!-- 修改的按钮，在有公告被选中的情况下，才能被点击，点击之后调用改变公告的方法 -->
            <el-button type="warning" :disabled="changeDisabled" @click="getChangePa">修改</el-button>
            <!-- 是否要删除公告的弹窗，确认之后就删除公告,配套一个删除的按钮 -->
            <el-popconfirm title="确定要删除吗？" 
                @confirm="confirmDel"
            >   
                <template #reference>
                    <el-button type="danger" :disabled="delDisabled">删除</el-button>
                </template>
            </el-popconfirm>
            <!-- 搜索框 -->
            <el-input v-model="input" placeholder="搜索公告标题" class="search" />
            <!-- 添加公告的弹窗界面 -->
            <el-dialog v-model="dialogTableVisible" title="添加公告">
                <h4>标题</h4>
                <el-input v-model="title" placeholder="请输入公告标题" />
                <h4>内容</h4>
                <!-- 获取公告的内容 -->
                <el-input
                    v-model="content"
                    :autosize="{ minRows: 5, maxRows: 5 }"
                    type="textarea"
                    placeholder="请输入公告内容"
                />
                <!-- 如果选择取消，隐藏弹出的界面，如果确定将新增公告内容添加到数据中 -->
                <div class="btn">
                    <el-button class="cancelBtn" @click="dialogTableVisible = false">取消</el-button>
                    <el-button type="primary" class="affirmBtn" @click="confirmAdd">确定</el-button>
                </div>
            </el-dialog>
            <!-- 改变公告的界面 -->
            <el-dialog v-model="dialogChangeVisible" title="修改公告">
                <h4>标题</h4>
                <el-input v-model="changeTitle" placeholder="请输入公告标题" />
                <h4>内容</h4>
                <el-input
                    v-model="changeContent"
                    :autosize="{ minRows: 5, maxRows: 5 }"
                    type="textarea"
                    placeholder="请输入公告内容"
                />
                <div class="btn">
                    <el-button class="cancelBtn" @click="dialogChangeVisible = false">取消</el-button>
                    <el-button type="primary" class="affirmBtn" @click="confirmUpdatePa">确定</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 公告表单主体部分 -->
        <div class="pa-table">
            <!-- 将获取的表单数据分隔成不同页面，呈现出来，实现选中之后才能操作的效果 -->
            <el-table 
            border
            :data="tableData.slice((page - 1) * pageSize, page * pageSize)" 
            style="width: 100%" 
            @select='operatePa'
            >
            <!-- 选择框，标题，发布时间，状态 -->
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="标题" width=""/>
                <el-table-column prop="created_at" label="发布时间" width="" />
                <el-table-column prop="state" label="状态" />
            </el-table>
        </div>
        <div class="page">
            <!-- 在第几页，几条数据一页，可以有几种分页方式，更新所处分页，并更新页面数据 -->
              <div class="demo-pagination-block">
                <el-pagination
                :current-page="page"
                :page-size="pageSize"
                :page-sizes="[5, 10]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageNoChange"
                />
            </div>
        </div>
    </el-card>
  </div>
</template>

<script>
// 获取公告数据
import { getPaDetail } from '@/api/paManage'
// 添加公告
import { addPa } from '@/api/paManage'
// 删除公告
import { delPa } from '@/api/paManage'
// 更新公告
import { updatePa } from '@/api/paManage'


export default {
    data() {
        return {
            row: [],
            title: '',
            defaultTitle: '',
            changeTitle: '',
            content: '',
            changeContent: '',
            defaultContent: '',
            tableData: [],
            page: 1,
            pageSize: 10,
            total: 0,
            changeDisabled: true,
            delDisabled: true,
            dialogTableVisible: false,
            dialogChangeVisible: false
        }
    },
    methods: {
        // 获取公告数据，初始化公告
        async initPa() {
            const res = await getPaDetail()
            this.tableData = res.data.getPagingNotice
            this.page = res.data.page
            this.pageSize = res.data.pageSize
            this.total = res.data.getPagingNotice.length
        }, 
        // 确认添加公告
        async confirmAdd() {
            this.dialogTableVisible = false
            await addPa(this.title,this.content)
        },
        // 确认删除公告，根据Id删除
        async confirmDel() {
            const delId = this.row[0].id
            const res = await delPa(delId)
        },
        //  获取到需要进行修改的界面数据，进行更新
        getChangePa() {
            this.changeTitle = this.row[0].title
            this.changeContent = this.row[0].content
            this.dialogChangeVisible = true
        },
        // 确认更新数据，将更新后的数据推到数据库
        async confirmUpdatePa() {
            await updatePa(this.row[0].id,this.changeTitle,this.changeContent)
            this.dialogChangeVisible = false
        },  
        // 确定分页大小
        pageSizeChange(val) {
            this.pageSize = val
        },
        // 确定所处页数
        pageNoChange(val) {
            this.page = val
        },
        // 实现选择之后才能将进行操作
        operatePa(row) {
            this.row = row
            if(row.length >= 1) {
                this.delDisabled = false
                this.changeDisabled = false
            } 
            else {
                this.delDisabled = true
                this.changeDisabled = true
            }
        }
    },
    created() {
        this.initPa()
    },
}
</script>

<style lang="scss" scoped>
.search {
    margin-left: 10px;
    display: inline;
}
.pa-table {
    margin: 15px;
}

.btn {
    margin-top: 20px;
    margin-left: 82%;
}

.delBtn {
    margin-top: 20px;
    margin-left: 40%;
}
</style>