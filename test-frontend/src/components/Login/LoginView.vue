<template>
  <div>
    <form name="login-form" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username">Username: </label>
        <input id="username" type="text" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password">Password: </label>
        <input id="password" type="password" v-model="password" required/>
      </div>
      <button
        type="submit"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../../api.js";

export default {
  name: "LoginView",
  setup(props, ctx) {
    const email = ref("");
    // const hidePassword = ref(true);
    const password = ref("");
    const router = useRouter();

    function handleSubmit() {
      if (email.length == 0 || password.length == 0) {
        return
      }

      sendLoginRequest(email.value, password.value)
    };

    function sendLoginRequest(email, password) {
      var basicAuth = btoa(email+':'+password)
      login(basicAuth)
        .then(response => {
          if (response == undefined) {
            return
          }

          sessionStorage.setItem("token", response.token);
          sessionStorage.setItem("isAdmin", JSON.stringify(response.user.is_admin));

          console.log("is Admin?")
          console.log(sessionStorage.getItem("isAdmin"))

          if (response.user.is_admin) {
            router.push("/admin");
          } else {
            router.push("/quiz");
          }
        })
        .catch(error => {
          console.log("Error logging in:")
          console.log(error)
        })
    }

    return {
      email,
      password,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
button{
  margin: 3%;
  width: 70px;
  height: 40px;
}
</style>
