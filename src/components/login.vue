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
                              <input type="number" 
                                v-model.trim="vcode" 
                                @change="checkVcode" 
                                v-on:input="keyupInput"
                                placeholder="输入验证码" 
                                oninput="if(value.length > 4)value = value.slice(0, 4)" 
                                class="input txt-vcode flex_item"
                              >
                              <input 
                                type="button" 
                                :value="codeTxt" 
                                class="input reg-vcode btn"
                                :class="{'codeGray': codeIsgray == false }"
                                @click="sendCode"
                                :disabled="codeIsDisabled"
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
                        <router-link tag="div" to="pwsLogin" class="link">密码登录</router-link>
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
      vcode:null,
      isBtnGray: false,
      isDisabled:true,

      //验证码
      codeTxt: '发送验证码', //验证码内容
      count: 60, //间隔函数，1秒执行
      curCount: null, // 剩余秒
      codeIsDisabled: false, // 按钮不能点击
      codeIsgray: true, // 按钮颜色
      interTimer: '' //定时器
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
      if(this.phone.length < 11){
          this.$toast.center('请输入11位手机号码');
          return false
      }
      /*if(!myreg.test(this.phone)){
          this.$toast.center('请输入有效的手机号码');
          return false
      }*/
      return true
    },

    //2、检验验证码
    checkVcode(){
      if(this.vcode == null || this.vcode.length<4){
          this.$toast.center('请输入验证码');
          return
      }
    },

    // 3、提交按钮状态
    keyupInput (){
      //let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; && myreg.test(this.phone)
      if(this.phone && this.phone.length >= 11 && this.vcode && this.vcode.length >= 4 ){
        this.isBtnGray = true;
        this.isDisabled = false;
      }else {
        this.isBtnGray = false;
        this.isDisabled = true;
      }
     
      if(this.vcode &&this.vcode.length >4 ){
        this.$toast.center('验证码最长4位');
        this.vcode = false;
      }
    },

    // 4、发送验证码
    sendCode(){
      if(!this.checkPhone()){
        return
      }
      

      //发送验证码 post
      let url = this.HOST + "/sendSmsCode";
      this.$axios.post(url, {
        phone: this.phone
      })
      .then((res)=> {
        let data = res.data;
        console.log(data)
        if(data.code === 1){
          this.$toast.center('验证码发送成功');
          this.curCount = this.count;
          this.codeIsDisabled = true;
          this.codeIsgray = false;
          // 计时器
          this.interTimer = setInterval(()=>{
            this.SetRemainTime();
          },1000);
          
        }else{
          this.$toast.center(data.msg);
          console.log(data.msg);
          return
        }
      })
      .catch(function (error) {
        console.log(error);
      })

    },
    // 5、验证码状态
    SetRemainTime(){
      // 倒计时为0时 
      if(this.curCount <= 0){
        clearInterval(this.interTimer);
        this.codeTxt = '重新发送';
        this.curCount = this.count;
        this.codeIsDisabled = false;
        this.codeIsgray = true;
        return
      }
      this.codeTxt = this.curCount + '秒再获取';
      this.curCount -= 1;
      console.log(this.curCount);
    },

    // 提交
    checkForm(e){
      e.preventDefault();
      //发送验证码 post
      let url = this.HOST + "/loginBySms";
      this.$axios.post(url, {
        phone: this.phone,
        code : this.vcode
      }).then((res)=> {
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


