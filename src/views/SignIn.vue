
// src/compnents/SignIn.vue


<template>
    <div class="container">
      <div class="loginPanel">
        <h1>SIGN IN</h1><br/>
          <div class="info">
            <p class="infoText">EMAIL</p>
            <input v-model="formData.email" type="text" placeholder="Email" >
            <div id="username_empty" >Please enter your username</div>
            <div id="username_incorrect" >Incorrect username or password</div>
            <p class="infoText">PASSWORD</p>
            <input v-model="formData.password" type="password" placeholder="Password">
            <div id="password_empty" class="input_error">Please enter your password</div>
          </div><br/>
          <h5>NO ACCOUNT? <a href="/signup">SIGN UP HERE</a></h5><br/>
        <button type="submit" @click="signIn">SIGN IN</button>
      </div>
    </div>
</template>

<script>
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'

export default {
  name: 'SignIn',
  data () {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signIn (){
        let user_empty = document.getElementById('username_empty')
        let pass_empty = document.getElementById('password_empty')
        let user_incorrect = document.getElementById('username_incorrect')
        let email = this.formData.email;
        let password = this.formData.password;

        //No username or password input
        if(email.length == 0){
          user_empty.style.display = "block";
          user_incorrect.style.display = "none"
        } else {
          user_empty.style.display = "none"
        }

        if(password.length == 0){
          pass_empty.style.display = "block";
          user_incorrect.style.display = "none"
        } else {
          pass_empty.style.display = "none"
        }

        if(email.length != 0 & password.length != 0){
          const auth = getAuth()
          signInWithEmailAndPassword(
              auth,
              this.formData.email,
              this.formData.password
          )
          .then((userCredential)=>{
              console.log("Successfully sign in!")
              this.$router.replace('/movielist')
          })
          .catch((error) => {
              console.log(error.code)
              pass_empty.style.display = "none"
              user_empty.style.display = "none"
              user_incorrect.style.display = "block"
          })
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.LogInContainer{
  margin: 50px auto;
  max-width: 400px;
  display: flex;
  font-family: "Tilt Warp";
  color: black;
  background-color: aliceblue;
  border-radius: 16px 16px 16px 16px;
  padding: 70px;
  white-space: nowrap;
  overflow:hidden
}

::placeholder{
  opacity: 50%;
}

p.info {
  text-align: left;
  margin-top: 10%;
}

#username_empty,
#password_empty{
  margin-left: 3px;
  opacity: 60%;
  font-size: 80%;
  text-align: left;
  color: red;
  display: none;
}

#username_incorrect{
  margin-left: 3px;
  opacity: 60%;
  font-size: 75%;
  text-align: left;
  color: red;
  display: none;
}
</style>
