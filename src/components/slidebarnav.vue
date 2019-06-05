<template>
  <div id="sidebar" class="sidebar-wrapper">
    <div class="sidebar-menu">
      <ul v-if="$store.state.terminal=='web'">
        <li
          class="sidebar-dropdown"
          v-for="item in navjson"
          :key="item.id"
          :class="currentId==item.id?'active':''">
          <a class="first">
            <span>{{ item.name }}</span>
          </a>
          <div class="spritesbox">
            <span class="sprites-lt"></span>
            <span class="sprites-rt"></span>
            <span class="sprites-lb"></span>
            <span class="sprites-rb"></span>
            <ul :class="'sidebar-submenu'+' '+item.id">
              <li
                :param0="item.id"
                :param1="itemlist.id"
                v-for="itemlist in item.second"
                :key="itemlist.id"
                :class="currentId==item.id&&currentList==itemlist.id?'ischecked':''"
                @click="changeList(item.id,itemlist.id,item.name,itemlist.name)"
              >
                <div class="radio_option">{{ itemlist.name }}</div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul v-if="$store.state.terminal=='phone'">
        <li
          class="sidebar-dropdown"
          v-for="item in navjson"
          :key="item.id"
          :class="currentId==item.id?'active':''">
          <a class="first" @click="changeSlide(item.id,item)">
            <span>{{ item.name }}</span>
          </a>
          <div class="spritesbox">
            <ul :class="'sidebar-submenu'+' '+item.id">
              <li
                :param0="item.id"
                :param1="itemlist.id"
                v-for="itemlist in item.second"
                :key="itemlist.id"
                @click="changeSlideList(item.id,itemlist.id,item.name,itemlist.name)"
              >
                <div class="radio_option">{{ itemlist.name }}</div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "slidbarnav",
  data() {
    return {
      terminal: this.$store.state.terminal,
      client: this.$store.state.client,
      navjson: [],
      currentId: this.$store.state.prodtype,
      currentList: this.$store.state.crop,
      open:"inbox",
    };
  },
  components: {},
  computed:{
    watchdata() {
      return this.$store.state.client;
    }
  },
  created() {
    //this.navGet();
    var clientname= this.$store.state.client;
    if (this.$store.state.client == "country") {
        clientname = "web";
      }
    if(this.$store.state.terminal=="phone"&&this.navjson.length==0){
     
      if(localStorage.getItem("nav")){
        var navval = JSON.parse(localStorage.getItem("nav"));
        if(navval.hasOwnProperty(clientname)){
          this.navjson=navval[clientname];
          this.currentId = this.$store.state.prodtype;
          this.currentList = this.$store.state.crop;
        }else{
          this.navGet(clientname);
        }
      }else{
        this.navGet();
      }
    }else{
      this.navGet();
    }
  },
  watch:{
    watchdata: function(newVal, oldVal) {
      this.navGet(newVal);
    }
  },
  methods: {
    //获取目录
    navGet(client) {
      var clientparms;
      if (this.$store.state.client == "country") {
        clientparms = "web";
      }else{
        if(client){
          clientparms = client;
        }else{
          clientparms = this.$store.state.client;
        }
        
      }
      this.$http
        .get("http://39.104.185.135/qgnq/api/v2/catalogs", {
          params: { client: clientparms }
        })
        .then(function(result) {
          this.navjson = result.body.data.catalog.first;
          this.currentId = this.navjson[0].id;
          this.currentList = this.navjson[0].second[0].id;
          var obj = {};
          obj[clientparms]=this.navjson;
          if(localStorage.getItem("nav")){
            localStorage.setItem("nav",JSON.stringify(obj));
          }else{
            localStorage.setItem("nav",JSON.stringify({clientparms:this.navjson}));
          }
         
        });
    },
    //切换导航
    changeList(itemId, itemlistId,itemhtml, itemlisthtml) {
      if(this.$store.state.prov!=''&&this.$store.state.prov!=440000){
        //切换不同first导航，删除默认时间及offset
        if(this.currentId !=itemId||this.currentList!=itemlistId){
          localStorage.removeItem("timedata");
          localStorage.removeItem("offsetval");
          localStorage.setItem("offsetval",0);
        }
      }
      this.currentId = itemId;
      this.currentList = itemlistId;
      //改变store内的prodType与crop
      this.$store.commit("changeProType", [itemId,itemhtml]);
      this.$store.commit("changeCrop", [itemlistId,itemlisthtml]);
      
    },
    changeSlide(itemId,item){
      this.currentId = itemId;
    },
    changeSlideList(itemId, itemlistId,itemhtml, itemlisthtml) {
      this.currentList = itemlistId;
      
      //改变store内的prodType与crop
      this.$store.commit("changeProType", [itemId,itemhtml]);
      this.$store.commit("changeCrop", [itemlistId,itemlisthtml]);
      this.$emit("listenToNav","显示")
    },
  }
};
</script>