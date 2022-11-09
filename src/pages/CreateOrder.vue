<template>
  <div class="admin-container">
    <form
      id="tableManagementForm"
      class="table-management-form"
      @submit.prevent="handleSubmit"
      novalidate
      autocomplete="off"
    >
      <h2 style="text-align: center; padding-bottom: 2em; font-weight: 900">
        Create Order
      </h2>

      <div v-if="errors.length" class="error-box">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div class="row mt-2">
        <button @click.prevent="addProduct">Add Another Product</button>
      </div>
      <template v-for="(product, index) in order_items" :key="index">
        <div>
            <div class="row mt-2">
        <div class="col-4"><span>Table type:</span></div>
        <div class="col-8">
          <v-select
            v-model="hotel.tableType"
            :clearable="false"
            :options="tableTypes"
          />
        </div>
      </div>
        </div>
      </template>
      <div class="row mt-2">
        <div class="col-4"><span>Table type:</span></div>
        <div class="col-8">
          <v-select
            v-model="hotel.tableType"
            :clearable="false"
            :options="tableTypes"
          />
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-4"><span>Table name:</span></div>
        <div class="col-8">
          <v-select
            v-model="hotel.tableName"
            :clearable="false"
            :options="tableNames"
          />
        </div>
      </div>

      <div class="row mt-2 form-group">
        <div class="col-4"><span>Count:</span></div>
        <div class="col-8">
          <input type="number" class="form-control" v-model="hotel.count" />
        </div>
      </div>

      <div class="row mt-2 form-group">
        <div class="col-4"><span>Description:</span></div>
        <div class="col-8">
          <input type="text" class="form-control" v-model="hotel.description" />
        </div>
      </div>

      <!-- <div class="row mt-2 form-group">
          <div class="col-4"><span>Image:</span></div>
          <div class="col-8">
            <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="uploadImage"
            />
          </div>
        </div>
        <div class="row mt-2 form-group">
          <div class="col-4"></div>
          <div class="col-8" v-if="isImageUploaded">
            <img :src="'http://localhost:8081/' + hotel.image" alt="" style="width: 30vw"/>
          </div>
        </div> -->

      <div class="form-group">
        <input type="submit" value="Submit" class="btn" />
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "TableAddOrEdit",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      product: {
        product_id: "",
        quantity: "",
      },
      // tableTypes: [
      //   { label: "2 Seating", value: "two_seating" },
      //   { label: "4 Seating", value: "four_seating" },
      //   { label: "8 Seating", value: "eight_seating" },
      // ],
      // tableNames: [
      //   { label: "Table 1", value: "table_1" },
      //   { label: "Table 2", value: "table_2" },
      //   { label: "Table 3", value: "table_3" },
      // ],
      order: {
        order_items: [
          {
            product_id: "",
            quantity: "",
          },
        ],
      },
      errors: [],
    };
  },
  computed: {
    isImageUploaded() {
      return this.hotel && !!this.hotel.image;
    },
  },
  mounted() {
    if (this.hotel && this.hotel.tableType)
      this.hotel.tableType = this.tableTypes[0];
  },
  methods: {
    addProduct() {
        this.order.order_items.push(this.product)
    },
    async handleSubmit() {
      this.errors = [];
      console.log("on hotel submit", this.hotel);
      const payload = {
        table_type: this.hotel.tableType.value || "",
        table_name: this.hotel.tableName.value || "",
        count: this.hotel.count,
        table_description: this.hotel.description,
        table_image: this.hotel.image,
      };
      try {
        const response = await axios.post("book-tables", payload);
        console.log("error", response);
      } catch (error) {
        console.log("error", error.data);
      }
    },
    async uploadImage(e) {
      if (e && e.target && e.target.files && e.target.files[0]) {
        console.log("response", e);
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const response = await axios.post("/upload", formData);
        console.log(response);
        if (response && response.data && response.data.imageUrl) {
          this.hotel.image = response.data.imageUrl;
        }
        console.log("response", response);
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

.table-management-form .form-control {
  margin: 0.7rem 0;
  border-radius: 0.5rem;
  background: #f7f7f7;
  padding: 2rem 1.2rem;
  font-size: 1.6rem;
  color: #130f40;
  text-transform: none;
  width: 100%;
  border: none;
}
.vs__search {
  margin: 0.7rem 0;
  border-radius: 0.5rem;
  background: #f7f7f7;
  padding: 2rem 1.2rem;
  font-size: 1.6rem;
  color: #130f40;
  text-transform: none;
  width: 100%;
  border: none;
}
</style>
