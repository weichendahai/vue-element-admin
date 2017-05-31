<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="登录名" v-model="listQuery.loginname">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="showCreate" type="primary" icon="edit">添加</el-button>
    </div>

      <el-table :data="list" style="width: 100%">
        <!-- {"id":2,"loginname":"test","password":"","email":null,"type":0,"status":1,"createTime":,"lastTime":1460629378000} -->
        <el-table-column prop="id" label="编号" width="160"> </el-table-column>
        <el-table-column prop="loginname" label="姓名" width="160"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>

        <!-- <el-table-column prop="type" label="类别" width="100"> </el-table-column> -->

          <el-table-column prop="type" label="类别" width="160">
            <template scope="scope">
              <span class="link-type" @click="showUpdate(scope.row)">{{scope.row.title}}</span>
              <el-tag>{{scope.row.type | typeFilter}}</el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="160"> </el-table-column>

        <el-table-column  align="center" label="操作">
          <template scope="scope">
            <el-button size="small" type="success" @click="showUpdate(scope.row)">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <!-- 用户编辑页面   =====  starter  ===== -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="用户名">
            <el-input v-model="temp.loginname"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="temp.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
          <!-- <el-form-item label="类别">
            <el-input v-model="temp.type"></el-input>
          </el-form-item> -->
          <el-form-item label="类型">
            <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
              <el-option v-for="item in  userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-input v-model="temp.status"></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建时间">
            <el-input v-model="temp.createTime"></el-input>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-input v-model="temp.lastTime"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="handleCreate">确 定</el-button>
          <el-button v-else type="primary" @click="handleUpdate">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 用户编辑页面   =====  end  ===== -->
  </div>
</template>


<script>
import { fetchList, deleteUser, insertUser, updateUser} from 'api/user';

const userTypeOptions = [
  { key: '0', display_name: '管理员' },
  { key: '1', display_name: '运营人员' },
  { key: '2', display_name: '市场人员' },
  { key: '3', display_name: '客服人员' }
];

// arr to obj
const userTypeKeyValue = userTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc
}, {});

export default {
  // name: 'user_user_list',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: null,
        loginname: '',
        password: '',
        email: '',
        type: '1',
        status: '1',
        // createTime: new Date(),
        // lastTime: new Date()
      },
      userTypeOptions,
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      showAuditor: false,
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  filters: {
    typeFilter(type) {
      return userTypeKeyValue[type]
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        // this.list = response.data.items;
        this.list = response.data;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined;
        this.listQuery.end = undefined;
        return;
      }
      this.listQuery.start = parseInt(+time[0] / 1000);
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
    },
    showCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    showUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
    },
    handleDelete(row) {

      this.$confirm('确认删除用户 [ ' + row.loginname +' ]？')
          .then(_ => {
            //删除用户数据
            var postData = { "userId" : row.id};
            deleteUser(postData).then(response => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              //再次加载数据
              this.getList();
            });
          })
          .catch(_ => {});
    },
    handleCreate () {
      insertUser(this.temp).then(response => {
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
        //再次加载数据
        this.getList();
      });
    },
    // update() {
    handleUpdate () {

      updateUser(this.temp).then(response => {
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
        //再次加载数据
        this.getList();
      });

      // this.temp.timestamp = +this.temp.timestamp;
      // for (const v of this.list) {
      //   if (v.id === this.temp.id) {
      //     const index = this.list.indexOf(v);
      //     this.list.splice(index, 1, this.temp);
      //     break;
      //   }
      // }
      // this.dialogFormVisible = false;
      // this.$notify({
      //   title: '成功',
      //   message: '更新成功',
      //   type: 'success',
      //   duration: 2000
      // });
    },
    resetTemp() {
      this.temp = {
        id: null,
        loginname: '',
        password: '',
        email: '',
        type: '1',
        status: '1',
        // createTime: new Date(),
        // lastTime: new Date(),

        // id: undefined,
        // importance: 0,
        // remark: '',
        // timestamp: 0,
        // title: '',
        // status: 'published',
        // type: ''
      };
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      })
    },
  }
}


</script>

<style scoped>
.box-card{
  width: 400px;
  margin: 20px auto;
}
.block{
  padding: 30px 24px;
}
.alert-item{
  margin-bottom: 10px;
}
.tag-item{
  margin-right: 15px;
}
</style>
