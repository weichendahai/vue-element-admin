<template>
  <div class="app-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <div >
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
        </el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->
      </div>

      <div class="createPost-main-container">

             <el-form-item label="登录用户名">
               <el-input v-model="postForm.loginname"></el-input>
             </el-form-item>
             <el-form-item label="密码">
               <el-input v-model="postForm.password"></el-input>
             </el-form-item>
             <el-form-item label="邮箱">
               <el-input v-model="postForm.email"></el-input>
             </el-form-item>
             <el-form-item label="类别">
               <el-input v-model="postForm.type"></el-input>
             </el-form-item>
             <el-form-item label="状态">
               <el-input v-model="postForm.status"></el-input>
             </el-form-item>

             <el-form-item label="创建时间">
               <el-input v-model="postForm.createTime"></el-input>
             </el-form-item>
             <el-form-item label="结束时间">
               <el-input v-model="postForm.lastTime"></el-input>
             </el-form-item>
      </div>
    </el-form>
  </div>
</template>


<script>

import { validateURL } from 'utils/validate';
import { insert } from 'api/user';

export default {
    // components: {
    //   'imp-panel': panel
    // },
    data(){

      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          });
          callback(null)
        } else {
          callback()
        }
      };

      return {
        postForm: {
          id: null,
          loginname: 'lili',
          password: '123456',
          email: 'xx@qq.com',
          type: '1',
          status: '1',
          createTime: '2017-01-01 12:00:00',
          lastTime: '2018-01-01 12:00:00',
        },
        loading: false,
        rules: {
          // name: [{ validator: validateRequire }],
          loginname: [{ validator: validateRequire }],
          // phone: [{ validator: validateRequire }],
          // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        }
      }
    },
    created(){
      // this.loadData();
    },
    methods: {
      submitForm() {
        // this.postForm.display_time = parseInt(this.display_time / 1000);
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            console.log(this.postForm)

            console.log ("xxxx sss xxx");
            insert(this.postForm).then(response => {
              console.log(111111);
              // this.tableData = response.data;
            });

            this.loading = true;
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            });
            // this.postForm.status = 'published';
            this.postForm.status = '1';

            this.loading = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }


</script>

<style scoped>

</style>
