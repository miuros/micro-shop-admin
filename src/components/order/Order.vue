<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
          <el-dialog :visible.sync="editDialogVisible"
      title=""
      width="35%"
      @close="editDialogClosed">
        <el-table :data="ar" width="800px">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="mobile"
                         prop="mobile" width="200px">
        </el-table-column>
        <el-table-column label="address"
                         prop="address" width="200px">
        </el-table-column>
        <el-table-column label="alias" prop="alias" width="100px"></el-table-column>
        </el-table>
      </el-dialog>

    <!--卡片视图区域-->
    <el-card class="box-card">

      <!--  用户列表区域-->
      <el-table :data="orderList"
                :stripe="true"
                border
                element-loading-text="拼命加载中"
                style="width: 100%">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="用户uid"
                         prop="userUuid">
        </el-table-column>
        <el-table-column label="商品id"
                         prop="productId">
        </el-table-column>
        <el-table-column label="手机号"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="数量"
                         prop="number">
        </el-table-column>
        <el-table-column label="支付时间"
                         prop="payTime">
        </el-table-column>
        <el-table-column label="订单状态" prop="status">
        </el-table-column>
        <el-table-column label="删除" prop="isDeleted">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" class="item" content="查看用户信息" effecct="dark" placement="top">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="getInfo(scope.row.id,scope.row.userUuid)">
              </el-button>
            </el-tooltip>
            <!-- 删除按钮-->
            <el-tooltip :enterable="false" class="item" content="删除订单" effect="dark" placement="top">
              <el-button icon="el-icon-delete" size="mini" type="danger"
                         @click="removeOrderById(scope.row.id)"></el-button>
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
    <el-dialog
      :visible.sync="editDialogVisible"
      title=""
      width="35%"
      @close="editDialogClosed">
      <!-- 内容主体区域 -->
       <el-table :data="ar"
                :stripe="true"
                border
                element-loading-text="拼命加载中"
                style="width: 100%">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="mobile" prop="mobile">

        </el-table-column>
        <el-table-column label="address" prop="address"></el-table-column>
        <el-table-column label="alias" prop="alias"></el-table-column>
        </el-table>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editOrderInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Orders.vue',
  data () {
    // 验证邮箱的规则
    return {
      editDialogVisible: false,
      editDialogClosed: false,
      ar: {},
      // 获取用户列表的参数对象
      queryInfo: {
        extra: '',
        // 当前的页数
        page: 1,
        limit: 2
      },
      orderList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      // 控制修改用户对话框的显示和隐藏
      // 查询到的用户信息对象
      editForm: {
        id: 0,
        userUuid: '',
        productId: 0,
        mobile: '',
        address: '',
        number: 0
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      orderInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoled: '',
      // loading状态控制
      loading: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getInfo (id, uid) {
      this.$http.get('/api/ar/v1/get?id=' + id + '&userUuid=' + uid).then(res => {
        if (res.data.code !== '200') {
          this.$message.error(res.data.msg)
        } else {
          this.editDialogVisible = true
          this.ar = [res.data.data]
        }
      })
    },
    async getOrderList () {
      this.loading = true
      const { data: res } = await this.$http.get('/api/od/v1/list?page=' + this.queryInfo.page + '&limit=' + this.queryInfo.limit)
      console.log(res)
      if (res.code !== '200') {
        return this.$message.error('获取订单列表失败!')
      }
      this.orderList = res.data
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
      this.getOrderList()
    },
    /**
     * 监听 页面值 改变的事件
     * @param newPage
     */
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    /**
     * 监听 添加用户对话框的关闭事件
     */
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    /**
     * 点击按钮, 添加新用户
     */
    async showEditDialog (scope) {
      // console.log(id)
      // const { data: res } = await this.$http.get(`order/info/${id}`)
      // if (res.meta.status !== 200) {
      // this.$message.error('查询用户信息失败!')
      // }
      // console.log(res)
      console.log(scope)
      this.editForm = scope
      this.editDialogVisible = true
    },
    async editOrderInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 可以发送修改用户的网络请求
        const { data: res } = await this.$http.put('/api/od/v1/update', JSON.stringify({
          id: parseInt(this.editForm.id),
          userUuid: this.editForm.userUuid,
          productId: parseInt(this.editForm.productId),
          mobile: this.editForm.mobile,
          number: parseInt(this.editForm.number)
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (res.code !== 200) {
          console.log(res.msg)
          this.$message.error('更新订单信息失败!')
        } else {
          // 先隐藏修改用户的对话框
          this.editDialogVisible = false
          // 再重新获取用户列表, 来刷新页面
          this.getOrderList()
          // 最后提示修改成功
          this.$message.success('更新订单信息成功!')
        }
      })
    },
    /**
     * 根据Id删除对应的用户信息
     * @param id
     */
    async removeOrderById (id) {
      console.log(id)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消删除, 则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      } else {
        console.log('确认了删除!')
        const { data: res } = await this.$http.delete('/api/od/v1/delete?id=' + id)
        if (res.code !== '200') {
          console.log(res.msg)
          return this.$message.error('删除订单失败!')
        } else {
          // 重新获取用户列表, 来刷新页面
          this.getOrderList()
          return this.$message.success('删除订单成功!')
        }
      }
    }
    /**
     * 展示分配角色的对话框, 并把用户信息保存起来到一个变量orderInfo中
     */
  }
}
</script>

<style lang="less" scoped>
</style>
