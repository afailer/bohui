<template>
  <div class="login">
      <div v-if="registerLogin">
        <h2 class="formtitle">省级农情遥感监测系统</h2>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form"  v-if="$store.state.terminal=='web'">
          <mu-form-item label="用户名" prop="username" :rules="usernameRules">
            <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="密码" prop="password" :rules="passwordRules">
            <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
          </mu-form-item>
          <mu-checkbox label="记住密码" v-model="validateForm.isAgree"  prop="isAgree"></mu-checkbox>
          <mu-form-item>
            <mu-button full-width class="btncurrent" @click="submit">登录</mu-button>
            <mu-button full-width class="btndefalut" @click="goRegister">注册</mu-button>
          </mu-form-item>
        </mu-form>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form" v-if="$store.state.terminal=='phone'">
          <mu-text-field v-model="validateForm.username" placeholder="请输入用户名" icon="perm_identity" 
          :help-text="errormessage.username" @blur="checkform('username')"></mu-text-field>
          <mu-text-field class="password" v-model="validateForm.password" placeholder="请输入密码" 
          icon="lock_open"
          :action-icon="visibility ? 'visibility' : 'visibility_off'" 
          :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" 
          :help-text="errormessage.password" @blur="checkform('password')"></mu-text-field>
          <mu-checkbox label="记住密码" v-model="validateForm.isAgree"  prop="isAgree"></mu-checkbox>
          <mu-button full-width class="btncurrent" @click="submit">登录</mu-button>
          <mu-button full-width class="btndefalut" @click="goRegister">注册</mu-button>
        </mu-form>
      </div>
      <div v-if="!registerLogin">
        <h2 class="formtitle">省级农情遥感监测系统</h2>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form" v-if="$store.state.terminal=='web'">
          <mu-form-item label="用户名" prop="username" :rules="usernameRules">
            <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="密码" prop="password" :rules="passwordRules">
            <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="确认密码" prop="passwordagain" :rules="passwordagainRules">
            <mu-text-field type="password" v-model="validateForm.passwordagain" prop="passwordagain"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="工作单位" prop="work" :rules="workRules">
            <mu-text-field type="text" v-model="validateForm.work" prop="work"></mu-text-field>
          </mu-form-item>
          <mu-form-item>
            <mu-button full-width class="btncurrent" @click="onregister">注册</mu-button>
            <mu-button full-width class="btndefalut" @click="gologin">登录</mu-button>
          </mu-form-item>
        </mu-form>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form" v-if="$store.state.terminal=='phone'">
          <mu-text-field v-model="validateForm.username" placeholder="请输入用户名" icon="perm_identity" 
          :help-text="errormessage.username" @blur="checkform('username')"></mu-text-field>
          <mu-text-field class="password" v-model="validateForm.password" placeholder="请输入密码" 
          icon="lock_open"
          :action-icon="visibility ? 'visibility' : 'visibility_off'"  
          :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" 
          :help-text="errormessage.password" @blur="checkform('password')"></mu-text-field>
          <mu-text-field class="password" v-model="validateForm.passwordagain" placeholder="请再次输入密码" 
          icon="lock_open"
          :action-icon="visibility ? 'visibility' : 'visibility_off'"  
          :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" 
          :help-text="errormessage.passwordagain" @blur="checkform('passwordagain')"></mu-text-field>
          <mu-text-field v-model="validateForm.work" placeholder="请输入工作单位" icon="business" 
          :help-text="errormessage.work" @blur="checkform('work')"></mu-text-field>
          <mu-button full-width class="btncurrent" @click="onregister">注册</mu-button>
          <mu-button full-width class="btndefalut" @click="gologin">登录</mu-button>
        </mu-form>
      </div>

    <mu-snackbar color="error" :position="this.position" :open.sync="this.open">
      {{this.message}}
      <mu-button flat slot="action" color="secondary" @click="changeopen">x</mu-button>
    </mu-snackbar>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      visibility: false,
      rule : /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
      usernameRules: [
        { validate: val => !!val, message: "用户名不能为空(建议邮箱)" },
        { validate: val => this.rule.test(val), message: "用户名（邮箱）格式不正确，请重新输入" }
      ],
      passwordRules: [
        { validate: val => !!val, message: "密码不能为空" },
        {
          validate: val => val.length >= 8,
          message: "密码长度不少于8位"
        }
      ],
      passwordagainRules: [
        { validate: val => !!val, message: "密码不能为空" },
        {
          validate: val => val.length >= 8,
          message: "密码长度不少于8位"
        },{
          validate: val => val == this.validateForm.password,
          message: "两次密码不相同，请重新输入！"
        }
      ],
      workRules: [
        { validate: val => !!val, message: "工作单位不能为空" }
      ],
      validateForm: {
        username: "",
        password: "",
        passwordagain:"",
        work:"",
        isAgree:true
      },
      rulemessage:{
        username:["用户名不能为空(建议邮箱)","用户名（邮箱）格式不正确，请重新输入" ],
        password:["密码不能为空","密码长度不少于8位" ],
        passwordagain:["密码不能为空","密码长度不少于8位","两次密码不相同，请重新输入！"],
        work:["工作单位不能为空"]
      },
      errormessage:{
        username: "",
        password: "",
        passwordagain:"",
        work:"",
      },

      position: "bottom", //msg位置
      message: "", //msg内容
      open: false, //msg显示
      timeout: 1000, //msg显示时间
      msgtimer: null, //msg定时
      registerLogin:true,
    };
  },
  created() {
    window.fullWidth = document.documentElement.clientWidth;
    if(window.fullWidth<1366){
      this.$store.commit("changeterminal","phone");
      this.setFontSize();
    }
    
  },
  beforeMount(){
    //console.log(localStorage.getItem("adduserdetail"));
    if(localStorage.getItem("adduserdetail")){
        var obj = JSON.parse(localStorage.getItem("adduserdetail"));
        this.validateForm.username=obj.username;
        this.validateForm.password=obj.password;
    }
  },
  components: {},
  methods: {
    checkform(name){
      var val = this.validateForm[name];
      if(val.length==0){
        this.errormessage[name] = this.rulemessage[name][0];
      }else{
        if(name=="username"&&!this.rule.test(val)){
          this.errormessage[name] = this.rulemessage[name][1];
        }else if((name=="passwordagain"||name=="password")&&val.length<8){
          this.errormessage[name] = this.rulemessage[name][1];
        }else if(name=="passwordagain"&&val!=this.validateForm.password){
          this.errormessage[name] = this.rulemessage[name][2];
        }else{
           this.errormessage[name] = "";
        }
      }
    },
    submit() {
      if(this.$store.state.terminal=="web"){
        this.$refs.form.validate().then(result => {
          var paramsval = this.$refs.form.$props.model;
          if(paramsval.isAgree){
            var object = { username: paramsval.username, password: paramsval.password };
            localStorage.setItem("adduserdetail", JSON.stringify(object));
          }else{
            if(localStorage.getItem("adduserdetail")){
              localStorage.removeItem('adduserdetail');
            }
          }
          var that= this;
          this.$http
            .post(this.$store.state.ipaddress+"auths/signin",
              { name: paramsval.username, password: paramsval.password },
              { emulateJSON: true }
            ).then(function(result) {
              if (result.body.status) {
                this.blurAdjust();
                var obj = result.body.data;
                localStorage.setItem("checkdata", JSON.stringify(obj));
                that.$store.commit('changeusername',paramsval.username);

                  //登录成功
                  that.showMsg("登录成功");
                  
                  if (that.$route.params.prov){
                    localStorage.setItem("provstorage", that.$route.params.prov);
                      that.$router.push({
                        path: "/",
                        query: { prov: that.$route.params.prov}
                      });
                    }else{
                      that.$router.push({
                        path: "/",
                        query: { prov: "country"}
                      });
                    }
              } else {
                that.showMsg(result.body.msg);
              }
            });
        });
      }else{
        var flag=false;
        for(var key in this.errormessage){
          if(this.errormessage[key]!=""){
            return
          }else{
            flag=true
          }
        }
        if(flag){
          if(this.validateForm.isAgree){
            var object = { username: this.validateForm.username, password: this.validateForm.password };
            localStorage.setItem("adduserdetail", JSON.stringify(object));
          }else{
            if(localStorage.getItem("adduserdetail")){
              localStorage.removeItem('adduserdetail');
            }
          }
          var that= this;
          this.$http
            .post(this.$store.state.ipaddress+"auths/signin",
              { name: this.validateForm.username, password: this.validateForm.password },
              { emulateJSON: true }
            ).then(function(result) {
              if (result.body.status) {
                this.blurAdjust();
                var obj = result.body.data;
                localStorage.setItem("checkdata", JSON.stringify(obj));
                that.$store.commit('changeusername',this.validateForm.username);

                  //登录成功
                  that.showMsg("登录成功");
                  
                  if (that.$route.params.prov){
                    localStorage.setItem("provstorage", that.$route.params.prov);
                      that.$router.push({
                        path: "/",
                        query: { prov: that.$route.params.prov}
                      });
                    }else{
                      that.$router.push({
                        path: "/",
                        query: { prov: "country"}
                      });
                    }
              } else {
                that.showMsg(result.body.msg);
              }
            });
        }

      }
      
    },
    onregister(){
      this.$refs.form.validate().then(result => {
        var paramsval = this.$refs.form.$props.model;
        var that= this;
        //console.log(paramsval)
        this.$http.post(this.$store.state.ipaddress+"auths/signup",
        {name: paramsval.username, password: paramsval.password,unit:paramsval.work},
        {emulateJSON:true}).then(function(result){
            //console.log(result)
            if(result.body.status){
                console.log(result.body.data);
                var obj = result.body.data;
                localStorage.setItem("checkdata", JSON.stringify(obj));
                that.$store.commit('changeusername',paramsval.username);
                //注册成功
                that.showMsg("注册成功");
                that.$router.push({
                      path: "/",
                      query: { prov: "country"}
                    });
            }else {
              that.showMsg(result.body.msg);
            }
        })
        
      });
    },
    goRegister(){
      this.registerLogin=false;
    },
    gologin(){
      this.registerLogin=true;
    },
    showMsg(msg, boolean) {
      if (this.msgtimer) clearTimeout(this.msgtimer);
      this.open = true;
      if (!boolean) {
        this.msgtimer = setTimeout(() => {
          this.open = false;
        }, this.timeout);
      }
      this.message = msg;
    },
    changeopen() {
      this.open = false;
    },
    setFontSize () {
      // 设计稿宽,以iPhone7的750px为准
      var designW = 750
      var fontRate = 100
      // 适配
      document.getElementsByTagName('html')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      document.getElementsByTagName('body')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      // 监测窗口大小变化
      window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
        document.getElementsByTagName('html')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
        document.getElementsByTagName('body')[0].style.fontSize = document.body.offsetWidth / designW * fontRate + 'px'
      }, false)
    },
    blurAdjust(e){
      setTimeout(()=>{
        // alert("1231321233")
        if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
          return
        }
        let result = 'pc';
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            result = 'ios'
        }else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
            result = 'android'
        }
        
        if( result = 'ios' ){
          document.activeElement.scrollIntoViewIfNeeded(true);
        }
      },100)
    }
  }
};
</script>

