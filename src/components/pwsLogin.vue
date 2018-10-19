<template>
   <div class="appBd">
     <div class="login-main">
        <div class="login-head">
            <div class="logo"><img src="../assets/img/logo.png" width="100%" /></div>
        </div>
          <section class="bd phone-login">
              <form 
                @submit="checkForm"
                method="post"
              >
                  <ul>
                      <li class="item-input flex">
                          <input type="tel" 
                            v-model.trim="phone" 
                            @change="checkPhone" 
                            v-on:input="keyupInput" 
                            placeholder="输入手机号" 
                            class="input flex_item" 
                            maxlength="11" />
                      </li>
                      <li class="item-input flex">
                          <div class="flex flex_item">
                              <input type="password" 
                                v-model.trim="pwss" 
                                @change="checkPwss" 
                                v-on:input="keyupInput" 
                                placeholder="输入密码" 
                                class="input txt-vcode flex_item"
                              >
                          </div>
                      </li>
                      <li class="item-submit">
                        <input 
                          type="submit" 
                          value="登 录" 
                          class="input btn regBtn" 
                          :class="{'regBtnGray':isBtnGray==false}" 
                          :disabled="isDisabled"
                          
                        />
                      </li>
                      <li class="pwsLogin text-center">
                        <router-link tag="div" to="/" class="link">验证码登录</router-link>
                      </li>
                  </ul>
              </form>
          </section>
      </div>
   </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      phone:null,
      pwss:null,
      isBtnGray: false,
      isDisabled:true,
    }
  },
  methods:{
    
    //1、检验手机号
    checkPhone(){
      //let myreg =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if(this.phone==null){
          this.$toast.center('手机号不能为空');
          return false
      }
      /*if(!myreg.test(this.phone)){
          this.$toast.center('请输入有效的手机号码');
          return false
      }*/
      return true
    },

    //2、检验验证码
    checkPwss(){
      if(this.pwss == null ){
          this.$toast.center('请输入验证码');
          return
      }else if(this.pwss.length<6){
          this.$toast.center('密码不小于6位');
          return
      }
    },

    // 3、提交按钮状态
    keyupInput (){
      //let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; && myreg.test(this.phone)
      if(this.phone && this.phone.length >= 11 && this.pwss && this.pwss.length >= 6 ){
        this.isBtnGray = true;
        this.isDisabled = false;
      }else {
        this.isBtnGray = false;
        this.isDisabled = true;
      }
    },

    // 提交
    checkForm(e){
      e.preventDefault();
      //发送验证码 post
      let url = this.HOST + "/login";
      this.$axios.post(url, {
        phone: this.phone,
        pwd: this.pwss
      }).then((res)=> {
          console.log(res);
        let data = res.data;
        console.log('成功了');
        if(data.code === 1){
          this.$toast.center('登录成功');
          // 保存token
          window.localStorage.setItem('token', window.JSON.stringify(res.data.data[0].LoginToken))
          console.log(res)
          this.$router.replace('/') //登录后跳转
        }else{
          this.$toast.center(data.msg);
          console.log(data.msg);
          return
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      
    }
  }
}
</script>
