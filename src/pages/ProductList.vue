<!-- eslint-disable vue/valid-v-for -->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="products-container">
    <div class="text-center">
      <h1>1. Choose Products</h1>
      <h6>* with required quantity</h6>
    </div>
    <div class="home-category">
      <div class="box" v-for="(product, index) in products" :key="index">
        <img :src="product.product_image" alt="" />
        <h3>{{ product.product_name }}</h3>
        <h5 style="text-transform: none; color: gray">
          {{ product.available_measure }}
        </h5>
        <h5>Rp. {{ product.price }}</h5>
        <div class="row">
          <div class="col-12 col-md-6"></div>
        </div>
        <input
          type="number"
          class="form-control text-center"
          v-model="product.quantity"
          min="1"
          style="width: 25%; margin: auto; padding: 10px"
        />
        <button
          class="btn"
          style="margin-top: 5px"
          @click.prevent="selectProduct(product)"
          v-if="!product.selected"
        >
          Select
        </button>
        <button
          class="btn btn-info"
          @click.prevent="deSelectProduct(product)"
          v-else
          style="margin-top: 5px; background-color: cadetblue"
        >
          Selected
        </button>
      </div>
    </div>
    <div class="text-center mt-5">
      <h1>2. Add Buyer Details</h1>
    </div>
    <div class="card">
      <div class="container text-center my-5 font-size-buyer-details">
        <div class="row mt-2">
          <div class="col-4">
            <span style="font-weight: 900">Added For: </span>(Mobile)*
          </div>
          <div class="col-8">
            <input
              type="tel"
              class="form-control"
              v-model="orderUserInfo.added_for_mobile"
            />
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-4">
            <span>Name:* </span>
          </div>
          <div class="col-8">
            <input
              type="text"
              class="form-control"
              v-model="orderUserInfo.added_for_name"
            />
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-4">
            <span>House Name:* </span>
          </div>
          <div class="col-8">
            <input
              type="text"
              class="form-control"
              v-model="orderUserInfo.added_for_house_name"
            />
          </div>
        </div>
        <div class="mt-2" style="color: red" v-if="isButtonDisabled.status">
          <h6>
            *Please select atleast one product and provide user details to order
          </h6>
        </div>
        <button
          class="btn mt-4"
          @click.prevent="bookOrder"
          :disabled="isButtonDisabled.status || orderLoader"
        >
          {{ orderLoader ? "Booking Order..." : "Book Order" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      orderUserInfo: {
        added_for_name: "",
        added_for_mobile: "",
        added_for_house_name: "",
      },
      products: [],
      orderLoader: false
    };
  },
  mounted() {
    this.fetchProducts();
  },
  computed: {
    isButtonDisabled() {
      let userDetails = Object.values(this.orderUserInfo);
      let orderItems = JSON.parse(JSON.stringify(this.products));
      orderItems = orderItems.filter((item) => !!item.selected);
      if (userDetails.includes("")) {
        return {
          status: true,
          message: "Some of the user details is missing.",
        };
      } else if (orderItems.length < 1) {
        return {
          status: true,
          message: "Please select atleast one product.",
        };
      }
      return {
        status: false,
        message: null,
      };
    },
  },
  methods: {
    selectProduct(selectedProduct) {
      const index = this.products.findIndex(
        (product) => product.id === selectedProduct.id
      );
      this.products[index].selected = true;
      console.log("selected products", this.products, selectedProduct);
      this.$forceUpdate();
    },
    deSelectProduct(selectedProduct) {
      const index = this.products.findIndex(
        (product) => product.id === selectedProduct.id
      );
      this.products[index].selected = false;
      console.log("selected products", this.products, selectedProduct);
      this.$forceUpdate();
    },
    async fetchProducts() {
      try {
        const response = await axios.get("/products");
        this.products = response.data;
        this.products =
          this.products.length > 0
            ? this.products.map((product) => {
                product.selected = false;
                product.quantity = 1;
                product.unit = product.available_measure;
                product.product_id = product.id;
                return product;
              })
            : [];
        this.$forceUpdate();
      } catch (error) {
        console.log(error);
      }
    },
    async bookOrder() {
      const toast = useToast();
      this.orderLoader = true;
      console.log("order", this.products);
      let orderItems = await JSON.parse(JSON.stringify(this.products));
      orderItems = await orderItems.filter((item) => !!item.selected);

      let totalAmount = 0;
      orderItems = await orderItems.map((item) => {
        const product = {};
        product.product_id = item.id;
        product.unit = item.available_measure;
        product.price = item.price;
        product.quantity = item.quantity;
        totalAmount += item.quantity * item.price;
        return product;
      });

      const payload = {
        order_items: orderItems,
        total_amount: totalAmount,
        added_for_mobile: this.orderUserInfo.added_for_mobile || "",
        added_for_name: this.orderUserInfo.added_for_name || "",
        added_for_house_name: this.orderUserInfo.added_for_house_name || "",
      };
      console.log("payload", payload);
      try {
        const response = await axios.post("orders", payload);

        // or with options
        toast.success("Order Booked Successfully!", {
          timeout: 5000,
        });
        setTimeout(() => {
          this.products =
            this.products.length > 0
              ? this.products.map((product) => {
                  product.selected = false;
                  product.quantity = 1;
                  product.unit = product.available_measure;
                  product.product_id = product.id;
                  return product;
                })
              : [];
          this.$forceUpdate();
          this.orderUserInfo = {
            added_for_name: "",
            added_for_mobile: "",
            added_for_house_name: "",
          };
          this.orderLoader = false;
        }, 5000);

        console.log("error", response);
      } catch (error) {
        toast.error("Order Failed. Please Contact Admin.", {
          timeout: 2000,
        });
        console.log("error", error.data);
        this.orderLoader = false;
      }
    },
    // async handleSubmit() {
    //   this.errors = [];
    //   let totalAmount = 0;
    //   this.order.order_items.forEach((item) => {
    //     totalAmount += item.price * item.quantity;
    //   });
    //   this.order.total_amount = totalAmount;
    //   console.log("on hotel submit", this.order);

    //   try {
    //     const response = await axios.post("orders", this.order);
    //     const toast = useToast();

    //     // or with options
    //     toast.success("Order Booked Successfully!", {
    //       timeout: 2000,
    //     });
    //     setTimeout(() => {
    //       this.order = {
    //         order_items: [
    //           {
    //             id: "",
    //             quantity: "",
    //           },
    //         ],
    //       };
    //     }, 2000);

    //     console.log("error", response);
    //   } catch (error) {
    //     console.log("error", error.data);
    //   }
    // },
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
.font-size-buyer-details {
  font-size: 1.2rem;
}
.products-container {
  margin: 4em 1.5em 4em 1.5em;
}
/* home category */
.home-category {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 1.5rem;
}

.home-category .box {
  padding: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  background: #f7f7f7;
}

.home-category .box:hover {
  background: #27ae60;
}

.home-category .box:hover h3 {
  color: #fff;
}

.home-category .box img {
  height: 7rem;
}

.home-category .box h3 {
  font-size: 1.8rem;
  color: #130f40;
}
</style>
