<template>

  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加轮播图</el-button>
        </el-col>
      </el-row>

      <!--  用户列表区域-->
      <el-table :data="bannersList"
                :stripe="true"
                border
                element-loading-text="拼命加载中"
                width="100%">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="name" prop="name" width="100px">
        </el-table-column>
        <el-table-column label="轮播图地址"
                         prop="imageUrl" width="200x">
        </el-table-column>
        <el-table-column label="重定向"
                         prop="redirectUrl" width="200px">
        </el-table-column>
        <el-table-column label="显示"
                         prop="imageUrl" width="300px">
          <template slot-scope="scope">
           <img :src="scope.row.imageUrl" style="width:200px;height:120px"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip :enterable="false" class="item" content="修改轮播图" effect="dark" placement="top">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮-->
            <el-tooltip :enterable="false" class="item" content="删除轮播图" effect="dark" placement="top">
              <el-button icon="el-icon-delete" size="mini" type="danger"
                         @click="removeBannersById(scope.row.id)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
        <el-dialog
      :visible.sync="addDialogVisible"
      title="添加轮播图"
      width="35%"
      @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" label-width="70px">
        <!-- prop=username 对应了 addFormRules中的username校验规则-->
        <el-form-item label="name" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="imageUrl">
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirectUrl">
          <el-input v-model="addForm.redirectUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addBanner">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialogVisible"
      title="修改"
      width="35%"
      @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" label-width="70px">
        <!-- prop=username 对应了 addFormRules中的username校验规则-->
        <el-form-item label="name" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="iimageUrl">
          <el-input v-model="editForm.imageUrl" ></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirectUrl">
          <el-input v-model="editForm.redirectUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editBannerInfo">确 定</el-button>
  </span>
    </el-dialog>

      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5,10,15,20]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      addForm: {
        name: '',
        imageUrl: '',
        redirectUrl: ''
      },
      editDialogVisible: false,
      editForm: {
        name: '',
        id: 0,
        imageUrl: '',
        redirectUrl: ''
      },
      addDialogVisible: false,
      // 查询列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      bannersList: []
    }
  },
  created () {
    this.getBannersList()
  },
  methods: {
    /**
     * 根据分页获取对应的商品列表
     */
    showEditDialog (data) {
      this.editDialogVisible = true
      this.editForm = data
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    async getBannersList () {
      /**
       * get请求, 参数上都加一个 params属性
       */
      const { data: res } = await this.$http.get('/api/bn/v1/list?page=' + this.queryInfo.pagenum + '&limit=' + this.queryInfo.pagesize)
      if (res.code !== '200') {
        return this.$message.error('获取轮播图列表失败!')
      } else {
        console.log(res)
        this.bannersList = res.data
        this.total = res.data.length
      }
    },
    async editBannerInfo () {
      const { data: res } = await this.$http.put('/api/bn/v1/update', JSON.stringify({
        id: this.editForm.id,
        name: this.editForm.name,
        imageUrl: this.editForm.imageUrl,
        redirectUrl: this.editForm.redirectUrl
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.code !== '200') {
        console.log(res.msg)
        return this.$message.error('failed to update')
      } else {
        this.getBannersList()
        this.$message.success('success')
        this.editDialogVisible = false
      }
    },
    async addBanner () {
      const { data: res } = await this.$http.post('/api/bn/v1/create', JSON.stringify({
        imageUrl: this.addForm.imageUrl,
        name: this.addForm.name,
        redirectUrl: this.addForm.redirectUrl
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.code !== '200') {
        console.log(res.msg)
        return this.$message.error('failed to add bannner')
      } else {
        this.getBannersList()
        return this.$message.success('success')
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getBannersList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getBannersList()
    },
    /**
     * @param bannersId
     */
    async removeBannersById (bannersId) {
      const confirmResult = await this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消删除, 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      } else {
        const { data: res } = await this.$http.delete(`/api/bn/v1/delete?id=${bannersId}`)
        if (res.code !== '200') {
          console.log(res.msg)
          return this.$message.error('删除轮播图失败!')
        } else {
          // 重新获取用户列表, 来刷新页面
          this.getBannersList()
          return this.$message.success('删除轮播图成功!')
        }
      }
    },
    editDialogClosed () {
      // 当第一次打开修改表单, 若触发数据校验提示, 在第二次打开还会出来
      // 这时候就是需要使用下面这行代码重置修改表单
      this.$refs.editFormRef.resetFields()
    },
    /**
     * 跳转页面添加
     */
    goAddpage () {
      this.addDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
