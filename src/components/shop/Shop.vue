<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商店管理</el-breadcrumb-item>
      <el-breadcrumb-item>商店列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input v-model="queryInfo.extra" class="input-with-select" clearable placeholder="请输入内容"
                    @clear="getShopList" @keyup.enter.native="getShopList">
            <el-button slot="append" icon="el-icon-search" @click="getShopList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商店</el-button>
        </el-col>
      </el-row>

      <!--  商店列表区域-->
      <el-table
                :data="shopList"
                :stripe="true"
                border
                element-loading-text="拼命加载中"
                style="width: 100%">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="商店名"
                         prop="name">
        </el-table-column>
        <el-table-column label="所有人"
                         prop="userUuid">
        </el-table-column>
        <el-table-column label="地址"
                         prop="address">
        </el-table-column>
        <el-table-column label="图片"
                         prop="imageUrl">
            <template slot-scope="scope">
                <img :src="scope.row.imageUrl" style="width: 200px;height:120px"/>
            </template>
        </el-table-column>
        <el-table-column label="状态" prop="isDeleted">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip :enterable="false" class="item" content="修改商店" effect="dark" placement="top">
              <el-button icon="el-icon-edit" size="mini" type="primary"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>

            <!-- 删除按钮-->
            <el-tooltip :enterable="false" class="item" content="删除商店" effect="dark" placement="top">
              <el-button icon="el-icon-delete" size="mini" type="danger"
                         @click="removeShopById(scope.row.id)"></el-button>
            </el-tooltip>

            <!-- 分配角色按钮
            <el-tooltip :enterable="false" class="item" content="分配角色" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini" type="warning" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
            -->
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        :current-page="queryInfo.page"
        :page-size="this.queryInfo.limit"
        :page-sizes="[2, 4, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 添加商店的对话框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      title="添加商店"
      width="35%"
      @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" label-width="70px">
        <!-- prop=shopname 对应了 addFormRules中的shopname校验规则-->
        <el-form-item label="商店名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所有人" prop="userUuid">
          <el-input v-model="addForm.userUuid"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addShop">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改商店对话框-->
    <el-dialog
      :visible.sync="editDialogVisible"
      title="修改商店"
      width="35%"
      @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" label-width="70px">
        <!-- prop=shopname 对应了 addFormRules中的shopname校验规则-->
        <el-form-item label="商店名">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="所有人" prop="owner">
          <el-input v-model="editForm.userUuid"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editShopInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Shops.vue',
  data () {
    // 验证邮箱的规则
    return {
      // 获取商店列表的参数对象
      queryInfo: {
        extra: '',
        // 当前的页数
        page: 1,
        limit: 2
      },
      shopList: [],
      total: 0,
      // 控制添加商店对话框的显示与隐藏
      addDialogVisible: false,
      // 添加商店的表单数据
      addForm: {
        name: '',
        userUuid: '',
        mail: '',
        imageUrl: '',
        address: ''

      },
      // 控制修改商店对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的商店信息对象
      editForm: {
        userUuid: '',
        name: '',
        imageUrl: '',
        address: ''
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的商店信息
      shopInfo: {},
      // 所有角色的数据列表
      // 已选中的角色Id值
      selectedRoled: '',
      // loading状态控制
      loading: false
    }
  },
  created () {
    this.getShopList()
  },
  methods: {
    async getShopList () {
      this.loading = true
      const { data: res } = await this.$http.get('/api/sp/v1/list?page' + this.queryInfo.page + '&limit=' + this.queryInfo.limit)
      if (res.code !== '200') {
        return this.$message.error('获取商店列表失败!')
      }
      this.shopList = res.data
      this.total = res.data.length
      this.loading = false
    },
    /**
     * 监听 pagesize 改变的事件
     * @param newSize
     */
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getShopList()
    },
    /**
     * 监听 页面值 改变的事件
     * @param newPage
     */
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getShopList()
    },
    async shopStateChanged (shopInfo) {
      console.log(shopInfo)
      const { data: res } = await this.$http.put('/api/sp/v1/update', {
        id: parseInt(this.editForm.id),
        name: this.editForm.name,
        userUuid: this.editForm.userUuid,
        address: this.editForm.address,
        imageUrl: this.editForm.imageUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.code !== '200') {
        shopInfo.isDeleted = !shopInfo.isDeleted
        return this.$message.error('更新商店状态失败!')
      }
      this.$message.success('更新商店状态成功!')
    },
    /**
     * 监听 添加商店对话框的关闭事件
     */
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    /**
     * 点击按钮, 添加新商店
     */
    addShop () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 可以发起添加商店的网络请求
        const { data: res } = await this.$http.post('/api/sp/v1/create', JSON.stringify({
          name: this.addForm.name,
          userUuid: this.addForm.userUuid,
          address: this.addForm.address,
          image: this.addForm.imageUrl
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(res)
        if (res.code !== '200') {
          console.log(res.msg)
          this.$message.error('添加商店失败!')
        } else {
          // 先隐藏添加商店的对话框
          this.addDialogVisible = false
          // 再重新获取商店列表, 来刷新页面
          this.getShopList()
          // 最后提示添加成功
          this.$message.success('添加商店成功!')
        }
      })
    },
    /**
     * 展示编辑商店的对话框
     * @param id
     */
    async showEditDialog (scope) {
      // console.log(id)
      // const { data: res } = await this.$http.get(`shop/info/${id}`)
      // if (res.meta.status !== 200) {
      // this.$message.error('查询商店信息失败!')
      // }
      // console.log(res)
      console.log(scope)
      this.editForm = scope
      this.editDialogVisible = true
    },
    /**
     * 监听修改商店对话框的关闭事件
     */
    editDialogClosed () {
      // 当第一次打开修改表单, 若触发数据校验提示, 在第二次打开还会出来
      // 这时候就是需要使用下面这行代码重置修改表单
      this.$refs.editFormRef.resetFields()
    },
    /**
     * 修改商店信息并提交
     */
    async editShopInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 可以发送修改商店的网络请求
        const { data: res } = await this.$http.put('/api/sp/v1/update', {
          id: parseInt(this.editForm.id),
          userUuid: this.editForm.uuid,
          name: this.editForm.name,
          address: this.editForm.address,
          imageUrl: this.editForm.imageUrl
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (res.code !== '200') {
          console.log(res.msg)
          this.$message.error('更新商店信息失败!')
        } else {
          // 先隐藏修改商店的对话框
          this.editDialogVisible = false
          // 再重新获取商店列表, 来刷新页面
          this.getShopList()
          // 最后提示修改成功
          this.$message.success('更新商店信息成功!')
        }
      })
    },
    /**
     * 根据Id删除对应的商店信息
     * @param id
     */
    async removeShopById (id) {
      console.log(id)
      // 弹框询问商店是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该商店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果商店确认删除, 则返回值为字符串 confirm
      // 如果商店取消删除, 则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      } else {
        console.log('确认了删除!')
        const { data: res } = await this.$http.delete(`/api/sp/v1/delete?id=${id}`)
        if (res.code !== '200') {
          console.log(res.msg)
          return this.$message.error('删除商店失败!')
        } else {
          // 重新获取商店列表, 来刷新页面
          this.getShopList()
          return this.$message.success('删除商店成功!')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
