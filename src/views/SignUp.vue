<template>
  <main>
    <div class="container">
      <div class="loginPanel">
        <h1>REGISTER</h1><br/>
          <div class="info">
            <p class="infoText">EMAIL</p>
            <input type="text" placeholder="Username" v-model="formData.email"/>
            <div id="username_empty" >Invalid Email</div>
            <div id="username_exists" >Email already registered</div>
            <p class="infoText">PASSWORD</p>
            <input type="password" placeholder="Password" v-model="formData.password"/>
            <div id="password_empty" >Invalid Password</div>
          </div><br/>
        <button type="submit" @click="signUp">REGISTER</button>
      </div>
    </div>
  </main>
</template>
<script>

import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

export default {
  name: 'SignUp',
  data () {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signUp () {
        let user_empty = document.getElementById('username_empty')
        let pass_empty = document.getElementById('password_empty')
        let user_exists = document.getElementById('username_exists')
        let email = this.formData.email;
        let password = this.formData.password;

        //No username or password input
        if(email.length == 0){
          user_empty.style.display = "block";
          user_exists.style.display = "none"
        } else {
          user_empty.style.display = "none"
        }

        if(password.length == 0){
          pass_empty.style.display = "block";
          user_exists.style.display = "none"
        } else {
          pass_empty.style.display = "none"
        }

        
        if (user_empty.style.display == "block" || pass_empty.style.display == "block") {
          return;
        }

        if(email.length != 0 & password.length != 0){
        const auth = getAuth()
            createUserWithEmailAndPassword(
                auth,
                this.formData.email,
                this.formData.password
            )
            .then((userCredential)=>{
                console.log("Successfully registered!")
                this.$router.replace('/signin')
            })
            .catch((error) => {
                console.log(error.code)
                pass_empty.style.display = "none"
                user_empty.style.display = "none"
                user_exists.style.display = "block"
            })
          }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


#username_exists{
  margin-left: 2px;
  opacity: 60%;
  text-align: left;
  font-size: 85%;
  color:red;
  display: none;
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

</style>
