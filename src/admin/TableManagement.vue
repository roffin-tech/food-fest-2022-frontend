<template>
  <div class="admin-container">
    <table class="table colored-header datatable project-list">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Birthday</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="users in allUser" :key="users.user_id">
          <td>{{ users.user_name }}</td>
          <td>{{ users.user_email }}</td>
          <td>{{ users.user_phone }}</td>
          <td>{{ users.user_birth }}</td>
          <td>{{ users.user_gender }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "TableAddOrEdit",
  data() {
    return {
      tablesData: []
    };
  },
  mounted() {
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.get('book-tables')
        this.tablesData = response
        console.log('error', response)
      } catch (error) {
        console.log('error', error.data)
      }
    },
  },
};
</script>

<style scoped>
.admin-container {
  background-color: #fff;
  min-height: calc(100vh - 109px);
  padding: 4em;
  font-size: 16px;
}

.admin-container {
    background-color: #fff;
    min-height: calc(100vh - 109px);
    padding: 4em;
    font-size: 16px;
  }
  
  .project-list > tbody > tr > td {
    padding: 12px 8px;
  }
  
  .project-list > tbody > tr > td .avatar {
    width: 22px;
    border: 1px solid #ccc;
  }
</style>
