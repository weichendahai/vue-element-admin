<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="showCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="showCreate" type="primary" icon="edit">删除</el-button>
    </div>

    <el-row slot="body">
      <!-- 临时去掉渲染；存在bug 问题 -->
      <!-- :render-content="renderContent" -->
      <el-col :span="6">
        <el-tree v-if="permissionTree"
                 :data="permissionTree"
                 ref="permissionTree"
                 show-checkbox
                 highlight-current
                 clearable node-key="id" :props="defaultProps"></el-tree>
      </el-col>
      <el-col :span="18">

        <!-- 权限编辑页面   =====  starter  ===== -->
        <el-form :model="form" ref="form">
          <el-form-item label="父级" :label-width="formLabelWidth">
          <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
          <!-- <el-select-tree v-model="form.parentId" :treeData="roleTree" :propNames="defaultProps" clearable
                  placeholder="请选择父级">
          </el-select-tree> -->
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文" :label-width="formLabelWidth">
          <el-input v-model="form.enName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否生效" :label-width="formLabelWidth">
          <el-radio class="radio" v-model="form.usable" label="1">是</el-radio>
          <el-radio class="radio" v-model="form.usable" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
          <el-slider v-model="form.sort"></el-slider>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
          <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'"></el-button>
          <el-button type="info" @click="settingResource($event,form.id)" icon="setting" v-show="form.id && form.id!=null">配置资源
          </el-button>
          <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=null">删除
          </el-button>
          </el-form-item>
        </el-form>
        <!-- 权限编辑页面   =====  end  ===== -->
      </el-col>
    </el-row>

  </div>
</template>


<script>
import { fetchList, deleteP, insert, update} from 'api/permission';

const data2 = [
  {
    id: 1,
    label: "一级 1",
    children: [
      {
        id: 4,
        label: "二级 1-1",
        children: [
          {
            id: 9,
            label: "三级 1-1-1"
          },
          {
            id: 10,
            label: "三级 1-1-2"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: "一级 2",
    children: [
      {
        id: 5,
        label: "二级 2-1"
      },
      {
        id: 6,
        label: "二级 2-2"
      }
    ]
  },
  {
    id: 3,
    label: "一级 3",
    children: [
      {
        id: 7,
        label: "二级 3-1"
      },
      {
        id: 8,
        label: "二级 3-2"
      }
    ]
  }
];


export default {
  data() {
    return {
      form : {
        id: null,
        parentId: null,
        name: '',
        enName: '',
        sort: 0,
        usable: '1',
        remarks: ''
      },
      formLabelWidth: '100px',

      permissionTree: data2,
      defaultProps: {
          children: 'children',
          label: 'label'
      },

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
            var postData = { "id" : row.id};
            deleteP(postData).then(response => {
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
      insert(this.temp).then(response => {
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

      update(this.temp).then(response => {
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
    },


    // // tree opertion
    // append(store, data) {
    //   store.append({ id: id++, label: 'testtest', children: [] }, data);
    // },
    //
    // remove(store, data) {
    //   store.remove(data);
    // },

    renderContent(h, { node, data, store }) {
        console.log (node);
        console.log ("--------1----");
        console.log (data);
        console.log ("--------2----");

        console.log (store);
      // return (
      //   <span>
      //     <span>
      //       <span>{node.label}</span>
      //     </span>
      //     <span style="float: right; margin-right: 20px">
      //       <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
      //       <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
      //     </span>
      //   </span>);
    }

  }
}
</script>
