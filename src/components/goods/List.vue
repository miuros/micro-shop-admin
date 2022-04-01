<template>

  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
          <el-button type="primary" @click="uploadImg">上传图片</el-button>
        </el-col>
      </el-row>

      <!--  用户列表区域-->
      <el-table :data="goodsList"
                :stripe="true"
                border
                element-loading-text="拼命加载中"
                width="100%">
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column label="商品名称"
                         prop="name" width="200px" >
        </el-table-column>
        <el-table-column label="原价"
                         prop="originPrice" width="100px">
        </el-table-column>
        <el-table-column label="售价"
                         prop="sellPrice" width="100px">
        </el-table-column>
        <el-table-column label="分类" prop="categoryId" width="100px">
        </el-table-column>
        <el-table-column label="描述" prop="extra" width="200px"></el-table-column>
        <el-table-column label="标签" prop="tags" width="100px"></el-table-column>
        <el-table-column label="图片" width="200px">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" style="width: 200px;height: 120px"/>
          </template>
        </el-table-column>
      <el-table-column label="isDeleted" prop="isDeleted" width="60px"></el-table-column>
        <el-table-column  label="操作" width="200px">
          <template slot-scope="scope" v-if="scope.row.isDeleted==0">
            <!-- 修改按钮 -->
            <el-tooltip :enterable="false" class="item" content="修改商品" effect="dark" placement="top">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" class="item" content="更改存储" effect="dark" aria-placeholder="top">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="showStockDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮-->
            <el-tooltip :enterable="false" class="item" content="删除商品" effect="dark" placement="top">
              <el-button icon="el-icon-delete" size="mini" type="danger"
                         @click="removeGoodsById(scope.row.id)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="uploadDialog" title="upload" width="60%">
        <el-upload
          refs="upload"
          class="upload"
          action="http://miuros.fun:10000/api/file/v1/upload"
          :headers="headers"
          :file-list="fileList"
          :on-success="onSuccess"
          name="files"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-dialog>
      <el-dialog
      :visible.sync="addDialogVisible"
      title="添加"
      width="35%"
      @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm"  label-width="70px">
        <!-- prop=username 对应了 addFormRules中的username校验规则-->
        <el-form-item label="名字" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="addForm.originPrice"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="sellPrice">
          <el-input v-model="addForm.sellPrice"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
            <el-select v-model="addForm.categoryId" placeholder="请选择">
              <el-option
                v-for="item in cgList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="addForm.tags"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-input v-model="addForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addProduct">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog :visible.sync="editStockDialog" title="create or update" width="35%" @close="closeStockDialog">
    <el-form label-width="70px" :model="stock">
      <el-form-item label="storage" prop="storage">
        <el-input v-model="stock.storage"></el-input>
      </el-form-item>

    </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editStockDialog = false">取 消</el-button>
    <el-button type="primary" @click="createStock">新建</el-button>
    <el-button type="primary" @click="updateStock">更新</el-button>
  </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog
      :visible.sync="editDialogVisible"
      title="修改"
      width="35%"
      @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" label-width="70px">
        <!-- prop=username 对应了 addFormRules中的username校验规则-->
        <el-form-item label="名字" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="editForm.originPrice"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="sellPrice">
          <el-input v-model="editForm.sellPrice"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="editForm.tags"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="editForm.categoryId" placeholder="请选择">
              <el-option
                v-for="item in cgList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-input v-model="editForm.imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editProductInfo">确 定</el-button>
  </span>
    </el-dialog>
      <!--分页区域-->
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

      stock: {
        productId: 0,
        storage: 0
      },
      cgList: [],
      uploadDialog: false,
      fileList: [],
      addForm: {
        name: '',
        originPrice: 0,
        sellPrice: 0,
        desc: '',
        tags: '',
        categoryId: 0,
        imageUrl: ''
      },
      editForm: {
        id: 0,
        name: '',
        originPrice: 0,
        sellPrice: 0,
        categoryId: 0,
        desc: '',
        tags: '',
        imageUrl: ''
      },
      headers: {},
      editStockDialog: false,
      closeStockDialog: false,
      addDialogVisible: false,
      editDialogVisible: false,
      // 查询列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      // 商品列表
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
    this.headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    this.getCgList()
  },
  methods: {
    async showStockDialog (id) {
      this.stock.productId = id
      var res = await this.$http.get('/api/sc/v1/get?id=' + this.stock.productId)
      if (res.data.code === '200') {
        this.stock.storage = res.data.data.storage
      } else {
        this.$message.error(res.data.data.msg)
      }
      this.editStockDialog = true
    },
    createStock () {
      this.$http.post('/api/sc/v1/create', JSON.stringify({
        productId: parseInt(this.stock.productId),
        storage: parseInt(this.stock.storage)
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.data.code === '200') {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.editStockDialog = false
    },
    updateStock () {
      this.$http.put('/api/sc/v1/update', JSON.stringify({
        productId: parseInt(this.stock.productId),
        storage: parseInt(this.stock.storage)
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.data.code === '200') {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.editStockDialog = false
    },
    getCgList () {
      this.$http.get('/api/cg/v1/list?limit=20').then(res => {
        if (res.data.code === '200') {
          this.cgList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    async uploadImg () {
      this.uploadDialog = true
    },
    onSuccess (response) {
      console.log(response)
      if (response.code === '200') {
        for (var i = 0; i < response.data.length; i++) {
          this.fileList.push({
            url: response.data[i],
            name: response.data[i]
          })
        }
      } else {
        this.$message.error(response.msg)
      }
    },
    /**
     * 根据分页获取对应的商品列表
     */
    async getGoodsList () {
      /**
       * get请求, 参数上都加一个 params属性
       */
      const { data: res } = await this.$http.get('/api/pd/v1/list?page=' + this.queryInfo.pagenum + '&limit=' + this.queryInfo.pagesize)
      if (res.code !== '200') {
        console.log(res.msg)
        return this.notifyError('获取商品列表失败!')
      } else {
        this.goodsList = res.data
        this.total = res.data.length
      }
    },
    async showEditDialog (scope) {
      // console.log(id)
      // const { data: res } = await this.$http.get(`user/info/${id}`)
      // if (res.meta.status !== 200) {
      // this.$message.error('查询用户信息失败!')
      // }
      // console.log(res)
      console.log(scope)
      this.editForm = scope
      this.editDialogVisible = true
    },
    /**
     * 监听修改用户对话框的关闭事件
     */
    editDialogClosed () {
      // 当第一次打开修改表单, 若触发数据校验提示, 在第二次打开还会出来
      // 这时候就是需要使用下面这行代码重置修改表单
      this.$refs.editFormRef.resetFields()
    },
    /**
     * 修改用户信息并提交
     */
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    async editProductInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        console.log(this.editForm.desc)
        // 可以发送修改用户的网络请求
        const { data: res } = await this.$http.put('api/pd/v1/update', {
          id: parseInt(this.editForm.id),
          name: this.editForm.name,
          shopId: this.shop.id,
          categoryId: this.editForm.categoryId,
          originPrice: parseFloat(this.editForm.originPrice),
          sellPrice: parseFloat(this.editForm.sellPrice),
          tags: this.editForm.tags,
          extra: this.editForm.desc,
          imageUrl: this.editForm.imageUrl
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (res.code !== '200') {
          this.$message.error('更新信息失败!')
        } else {
          // 先隐藏修改用户的对话框
          this.editDialogVisible = false
          // 再重新获取用户列表, 来刷新页面
          this.getGoodsList()
          // 最后提示修改成功
          this.$message.success('更新信息成功!')
        }
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    /**
     * @param goodsId
     */
    async removeGoodsById (goodsId) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
        const { data: res } = await this.$http.delete(`/api/pd/v1/delete?id=${goodsId}`)
        if (res.code !== '200') {
          return this.$message.error('删除商品失败!')
        } else {
          // 重新获取用户列表, 来刷新页面
          this.getGoodsList()
          return this.$message.success('删除商品成功!')
        }
      }
    },
    addProduct () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/api/pd/v1/create', {
          name: this.addForm.name,
          originPrice: parseFloat(this.addForm.originPrice),
          sellPrice: parseFloat(this.addForm.sellPrice),
          tags: this.addForm.tags,
          extra: this.addForm.desc,
          shopId: this.shopp.id,
          categoryId: this.addForm.categoryId,
          imageUrl: this.addForm.imageUrl
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (res.code !== '200') {
          console.log(res.msg)
          this.$message.error('添加失败!')
        } else {
          // 先隐藏添加用户的对话框
          this.addDialogVisible = false
          // 再重新获取用户列表, 来刷新页面
          this.getGoodsList()
          // 最后提示添加成功
          this.$message.success('添加成功!')
        }
      })
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
