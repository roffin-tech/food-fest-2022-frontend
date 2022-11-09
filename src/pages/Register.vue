<template>
    <div class="register-container">
        <div class="register-form-container">
            <form id="registerForm" @submit="handleSubmit" novalidate autocomplete="off">
                <h3>Create your account</h3>

                <div class="form-group">
                    <label for="uPhone">Enter your phone number:
                    </label>
                    <input type="tel" name="uPhone" placeholder="Enter phone number" id="uPhone"
                        class="form-control" v-model="registerObj.user_phone" />
                    <p class="error-mess" v-if="errorObj.phoneErr.length > 0">{{ errorObj.phoneErr[0] }}</p>
                </div>

                <div class="form-group">
                    <label for="uName">Enter house name:
                    </label>
                    <input type="text" name="uName" placeholder="House name" id="uName" class="form-control"
                        v-model="registerObj.user_home" />
                    <p class="error-mess" v-if="errorObj.nameErr.length > 0">{{ errorObj.nameErr[0] }}</p>
                </div>

                <div class="form-group">
                    <label for="uPass">Enter your password:
                    </label>
                    <input type="password" name="uPass" placeholder="enter your password" id="uPass"
                        class="form-control" v-model="registerObj.user_password" />
                    <p class="error-mess" v-if="errorObj.passErr.length > 0">{{ errorObj.passErr[0] }}</p>
                </div>

                <div class="form-group">
                    <label for="uPassConfirm">Check your password again:
                    </label>
                    <input type="password" name="uPassConfirm" placeholder="enter your password again" id="uPassConfirm"
                        class="form-control" v-model="registerObj.confirm" />
                    <p class="error-mess" v-if="errorObj.confirmErr.length > 0">{{ errorObj.confirmErr[0] }}</p>
                </div>

                <div class="form-group">
                    <label for="uEmail">Enter your email:
                    </label>
                    <input type="email" name="uEmail" placeholder="example@gmail.com" id="uEmail" class="form-control"
                        v-model="registerObj.user_email" />
                    <p class="error-mess" v-if="errorObj.emailErr.length > 0">{{ errorObj.emailErr[0] }}</p>
                </div>

                <div class="form-group" v-if="!!serverError">
                    <span style="color: red">
                        {{serverError}}
                    </span>
                </div>

                <div class="form-group">
                    <input type="submit" value="join us" class="btn" />
                    <p>have an account? <router-link @click="scrollToTop()" to="/login">login</router-link>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authMixin from '@/mixins/authMixin';
export default {
    name: "Register",
    mixins: [authMixin],

    data() {
        return {
            registerObj: { user_phone: '', user_home: '', user_password: '', confirm: '', user_email: '' },
            errorObj: { nameErr: [], emailErr: [], passErr: [], confirmErr: [], phoneErr: [], },
            matchUser: undefined,

        }
    },
    watch: {
        registerObj: {
            handler() {
                this.serverError = null
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        async getMatchUser(email) {
            let data = await axios.get('/users/' + email);
            this.matchUser = data.data;
        },

        scrollToTop() {
            window.scrollTo(0, 0);
        },

        availableTime: function () {
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);
            var minRange = (now.getFullYear() - 150) + "-" + currentMonth + "-" + day;
            var maxRange = now.getFullYear() + "-" + currentMonth + "-" + day;

            document.getElementById("uBirth").setAttribute("min", minRange);
            document.getElementById("uBirth").setAttribute("max", maxRange);
        },

        resetCheckErr: function () {
            this.errorObj.nameErr = [];
            this.errorObj.emailErr = [];
            this.errorObj.passErr = [];
            this.errorObj.confirmErr = [];
            this.errorObj.phoneErr = [];
        },

        checkEmptyErr: function () {
            for (var typeErr in this.errorObj) {
                if (this.errorObj[typeErr].length != 0) {
                    return false;
                }
            }
            return true;
        },

        checkForm: function () {
            this.resetCheckErr();

            // Name validate
            if (!this.registerObj.user_home) {
                this.errorObj.nameErr.push("Entering home name is required");
            }
            else {
                if (!/^[A-Za-z]+$/.test(this.registerObj.user_home.replace(/\s/g, ""))) {
                    this.errorObj.nameErr.push('Home name can only contain letters');
                }
            }

            // Email validate
            // if (!this.registerObj.user_email) {
            //     this.errorObj.emailErr.push("Entering a email is required");
            // }
            // else {
            //     if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.registerObj.email)) {
            //         this.errorObj.emailErr.push('Email must be valid');
            //     }
            // }

            // Pass validate
            if (!this.registerObj.user_password) {
                this.errorObj.passErr.push('Password is required');
            }
            else {
                if (!/[!@#$%^&*]/.test(this.registerObj.user_password)) {
                    this.errorObj.passErr.push('Password must contain at least 1 special character');
                }

                if (this.registerObj.user_password.length < 6) {
                    this.errorObj.passErr.push('Password must be more than or equal 6 characters');
                }
            }

            // Confirm Pass validate
            if (!this.registerObj.confirm) {
                this.errorObj.confirmErr.push('Confirm password is required');
            }
            else {
                if (this.registerObj.user_password !== this.registerObj.confirm) {
                    this.errorObj.confirmErr.push('Confirm password must be match with password');
                }
            }


            // Phone validate
            if (!this.registerObj.user_phone) {
                this.errorObj.phoneErr.push('Entering phone number is required');
            }
            else {

                if (this.registerObj.user_phone.length != 10) {
                    this.errorObj.phoneErr.push('Phone numbers must have exactly 10 digits');
                }

                if (!/[0-9]{10}/.test(this.registerObj.user_phone)) {
                    this.errorObj.phoneErr.push('Phone numbers can only contain numbers');
                }
            }
        },

        async handleSubmit(e) {
            await this.checkForm();

            if (!this.checkEmptyErr()) {
                e.preventDefault();
            } else {
                e.preventDefault();
                try {
                    let data = JSON.parse(JSON.stringify(this.registerObj))
                    delete data.confirm
                    await axios.post("/users/", data);
                    this.$router.push("/login");
                } catch (error) {
                    this.showError(error)
                }
                    
            }
        }
    },

};
</script>


<style scoped>
.register-container {
    padding: 2rem 9%;
}

.register-container .register-form-container {
    background: #fff;

}

.register-container .register-form-container form {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0%);
    max-width: 70rem;
    width: 100%;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
    padding: 2rem;
    border-radius: 0.5rem;
    animation: fadeUp 0.4s linear;
}

.register-container .register-form-container form h3 {
    padding-bottom: 1rem;
    font-size: 2rem;
    text-transform: uppercase;
    color: #130f40;
    margin: 0;
}

.register-container .register-form-container form .form-control {
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

.register-container .register-form-container form label {
    font-size: 2rem;
    margin: 0;
    padding: 0;
}

.register-container .register-form-container form span {
    font-size: 18px;
    padding-left: 5px;
    padding-right: 40px;
}

.register-container .register-form-container form .btn {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
}

.register-container .register-form-container form p {
    padding-top: 1rem;
    font-size: 1.5rem;
    color: #666;
    margin: 0;
}

.register-container .register-form-container form p a {
    color: #27ae60;
}

.register-container .register-form-container form p a:hover {
    color: #130f40;
    text-decoration: underline;
}

.register-container .register-form-container form .form-group {
    margin: 0;
}

.register-container .register-form-container form .form-group .error-mess {
    font-size: 1.5rem;
    position: relative;
    color: rgb(243, 47, 47);
    margin: 0;
    padding: 0;
}
</style>
