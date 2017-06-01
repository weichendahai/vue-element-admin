<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色名" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="showCreate" type="primary" icon="edit">添加</el-button>
    </div>

      <el-table :data="list" style="width: 100%">
        <!-- {"id":2,"loginname":"test","password":"","email":null,"type":0,"status":1,"createTime":,"lastTime":1460629378000} -->
        <el-table-column prop="id" label="编号" width="160"> </el-table-column>
        <el-table-column prop="name" label="角色名" width="180"> </el-table-column>
        <el-table-column prop="sort" label="排序" width="160"> </el-table-column>
        <el-table-column prop="description" label="描述" width="180"> </el-table-column>

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
          <el-form-item label="角色名">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="temp.sort"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="temp.description"></el-input>
          </el-form-item>
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
import { fetchList, deleteRole, insertRole, updateRole} from 'api/role';

export default {
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
        name: '',
        sort: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.getList();
  },
  filters: {
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

      this.$confirm('确认删除角色 [ ' + row.name +' ]？')
          .then(_ => {
            //删除用户数据
            var postData = { "roleId" : row.id};
            deleteRole(postData).then(response => {
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
      insertRole(this.temp).then(response => {
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

      updateRole(this.temp).then(response => {
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
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: '',
        sort: '',
        description: ''
      };
    }
  }
}


</script>

<style scoped>
/*.box-card{
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
}*/
</style>
