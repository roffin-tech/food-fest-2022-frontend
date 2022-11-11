<!-- eslint-disable vue/valid-v-for -->
<!-- eslint-disable vue/no-parsing-error -->
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
      <div class="row mt-2"></div>
      <div class="row mt-2">
        <div class="col-4"></div>
        <div class="col-8">
          <button @click.prevent="addProduct" class="btn add-another-product">
            Add Another Product
          </button>
        </div>
      </div>
      <template v-if="order && order.order_items">
        <div v-for="(data, index) in order.order_items" :key="index">
          <template
            v-for="(product, index1) in products"
            :key="index * 1000 + index1"
          >
            <div class="row mt-2">
              <div class="col-4">
                <span>Product {{ index + 1 }}:</span>
              </div>
              <div class="col-8">
                <!-- <v-select
                v-model="data.product_id"
                value="id"
                label="product_name"
                :clearable="false"
                :options="products"
              /> -->
                <select
                  name="product"
                  id="product"
                  style="
                    width: 100%;
                    height: calc(1.5em + 0.75rem + 2px);
                    border: revert;
                    border-radius: 5px;
                    border-color: #f7f7f7;
                    background-color: #f7f7f7;
                  "
                  v-model="data.product_id"
                  @change="
                    data.price = product.price;
                    data.unit = product.available_measure;
                  "
                >
                  <option :value="product.id">
                    {{ product.product_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row mt-2 form-group">
              <div class="col-4"><span>Price:</span></div>
              <div class="col-8">
                <input
                  readonly
                  type="number"
                  class="form-control"
                  v-model="data.price"
                />
              </div>
            </div>
            <div class="row mt-2 form-group">
              <div class="col-4"><span>Unit:</span></div>
              <div class="col-8">
                <input
                  readonly
                  type="text"
                  class="form-control"
                  v-model="data.unit"
                />
              </div>
            </div>
          </template>
          <div class="row mt-2 form-group">
            <div class="col-4"><span>Quantity Needed:</span></div>
            <div class="col-8">
              <input
                type="number"
                class="form-control"
                v-model="data.quantity"
              />
            </div>
          </div>
        </div>
      </template>
      <div class="row mt-2">
        <div class="col-4">
          <span style="font-weight: 900">Added For: </span>(Mobile)
        </div>
        <div class="col-8">
          <input
            type="tel"
            class="form-control"
            v-model="order.added_for_mobile"
          />
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-4">
          <span>Name: </span>
        </div>
        <div class="col-8">
          <input
            type="tel"
            class="form-control"
            v-model="order.added_for_name"
          />
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-4">
          <span>House Name: </span>
        </div>
        <div class="col-8">
          <input
            type="tel"
            class="form-control"
            v-model="order.added_for_house_name"
          />
        </div>
      </div>
      <!-- <div class="row mt-2 form-group">
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
      </div> -->

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
import { useToast } from "vue-toastification";
// import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "TableAddOrEdit",

  components: {
    // "v-select": vSelect,
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
      products: [],
    };
  },
  computed: {
    isImageUploaded() {
      return this.hotel && !!this.hotel.image;
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    addProduct() {
      this.order.order_items.push(this.product);
    },
    async fetchProducts() {
      try {
        const response = await axios.get("/products");
        this.products = response.data;
        this.$forceUpdate();
      } catch (error) {
        console.log(error);
      }
    },
    async handleSubmit() {
      this.errors = [];
      let totalAmount = 0;
      this.order.order_items.forEach((item) => {
        totalAmount += item.price * item.quantity;
      });
      this.order.total_amount = totalAmount;
      console.log("on hotel submit", this.order);

      try {
        const response = await axios.post("orders", this.order);
        const toast = useToast();

        // or with options
        toast.success("Order Booked Successfully!", {
          timeout: 2000,
        });
        setTimeout(() => {
          this.order = {
            order_items: [
              {
                product_id: "",
                quantity: "",
              },
            ],
          };
        }, 2000);

        console.log("error", response);
      } catch (error) {
        console.log("error", error.data);
      }
    },
    // async uploadImage(e) {
    //   if (e && e.target && e.target.files && e.target.files[0]) {
    //     console.log("response", e);
    //     const formData = new FormData();
    //     formData.append("image", e.target.files[0]);
    //     const response = await axios.post("/upload", formData);
    //     console.log(response);
    //     if (response && response.data && response.data.imageUrl) {
    //       this.hotel.image = response.data.imageUrl;
    //     }
    //     console.log("response", response);
    //   }
    // },
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

.add-another-product {
  font-size: 1.2rem !important;
  float: right;
}
</style>
