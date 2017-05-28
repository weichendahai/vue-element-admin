<template>
  <div class="app-container">
    <code>user list user user</code>
     <p>{{ message }}</p>
  </div>
</template>


<script>
import { getList } from 'api/user';

export default {
  name: 'table_demo',
  data() {
    return {
      message : "this user page 01"
    }
  },
  created() {
    this.getList();
  },
  filters: {

  },
  methods: {
    getList() {
      console.log(123123);
      this.message = "xxxxxx";

      getList().then(response => {
        console.log(111111);
        // this.list = response.data.items;
        // this.total = response.data.total;
        // this.listLoading = false;
        // this.olderList = this.list.map(v => v.id);
        // this.newList = this.olderList.slice();
        // this.$nextTick(() => {
        //   this.setSort()
        // })
      })
      // fetchList().then(response => {
      // })；
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
