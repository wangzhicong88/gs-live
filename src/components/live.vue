<!-- 直播课 -->
<template>
  <div class="live-body">
     <header class="live-header tac" ref="liveHead">
          <h4>我的直播课</h4>
          <ul class="tabs">
              <li 
                v-for="(cateItem,index) in liveCouresList"
                :class="{current: index==nowIndex}"
                @click="toggleTabs(index)"
              >{{cateItem.sClassName}}</li>
          </ul>
      </header>
      <main class="contents liveCoureList" :style="{'padding-top': mainTop + 'px'}">
            <h4 class="title">讲次列表</h4>
            <div class="con">
                <!--班级1-->
                <div class="box">
                    <section v-for="(item,index) in liveCouresLists[nowIndex]._live">
                        <div class="hd">
                            <h4>第{{item.lessonIndex}}讲：{{item.lessonTitel}}</h4>
                        </div>
                        <div class="flex">
                            <div class="down">
                              <a v-for="(link,index) in item.lessonFile" :href="link">下载讲义 {{index + 1}}</a>
                            </div>
                            <div class="state">
                                <!--1、回放：当前时间大于开始时间-->
                                <span class="icon backPlay" 
                                  @click="getLiveShow(item.lessonLiveRoomId,item.classCode,item.lessonIndex)" 
                                  v-if="item.currDatesNew > item.lessonLiveEndTime"
                                >回放</span>

                                <!--2、进入直播：当前时间大于 开始 并小结束时间-->
                                <span class='icon goPlay' 
                                  @click="getLiveShow(item.lessonLiveRoomId,item.classCode,item.lessonIndex)" 
                                  v-else-if="item.currDatesNew > item.lessonLiveBeginTime && 
                                    item.currDatesNew < item.lessonLiveEndTime && item.lessonLiveStatus == 2"
                                >直播回放中</span>
                                <span class='icon goPlay' 
                                  @click="getLiveShow(item.lessonLiveRoomId,item.classCode,item.lessonIndex)" 
                                  v-else-if="item.currDatesNew > item.lessonLiveBeginTime && 
                                    item.currDatesNew < item.lessonLiveEndTime && item.lessonLiveStatus == 1"
                                >进入直播</span>
                                
                                <!--3、倒计时：当前时间减开始时间小于30 并 当前时间小于开始时间-->
                                <span 
                                  @click="getLiveShow(item.lessonLiveRoomId,item.classCode,item.lessonIndex)" 
                                  class='icon countDownPlay' 
                                  v-else-if="item.lessonLiveBeginTime - item.currDatesNew < item.cha && 
                                    item.currDatesNew < item.lessonLiveBeginTime">
                                  直播倒计时：{{item.InterStr}}
                                </span>
                                
                                <!--4、未开始 当前小于结束 并 -->
                                <span class='icon time' 
                                  v-else="item.currDatesNew < item.lessonLiveBeginTime && 
                                    item.lessonLiveBeginTime - item.currDatesNew > item.cha">
                                    直播时间：{{item.beginD}}~{{item.endD}}
                                </span>
                            </div>
                          </div>
                    </section>
                    <div class="sectNoText"  v-if="liveCouresList.length <= 0 ? true : false">您登录的账号没有报名课程，请更换账号重试</div>
                    <div class="sectNoText"  v-else-if="liveCouresLists[nowIndex]._live.length <= 0 ? noLiveCoures : !noLiveCoures">对应讲次的直播，要在下课后12小时后才会生成，请耐心等待。</div>
                    
                </div>
            </div>
        </main>
  </div>
</template>
<script>
export default {
  name: "live",
  data() {
    
    return {
        token: '',
        liveCouresList: [],
        Intervalss: false,
        mainTop: null,
        // tabs
        tabsParam: [],
        nowIndex: 0,
        room: '',
        liveCouresLists:[{_live:[]}],
        noLiveCoures: true
    };
  },
  created() {
    this.token = window.localStorage.getItem('token');
    var that = this;

    let url = this.HOST + "/lessonLive";
    this.$axios.post(url).then(res => {
        
        // 登录过期
        if(res.data.code == -1010){
          this.$toast.center('登录超时，请重新登录');
          this.$router.replace("/login");
        }

        // code为1 返回数据
        this.liveCouresList = res.data;
        console.log(res);
  
        var nums = [];
        var tab;
        var liveData = this.liveCouresList;

        for(var j = 0; j < liveData.length; j++){
          let urlll = liveData[j]._live;
          
          for (var i = 0; i < urlll.length; i++) {
              tab = urlll[i];
              //重定义 开始时间 mm-dd-tt-bb
              let beginT= that.formatTime(urlll[i].lessonLiveBeginTime * 1000);
              let begin2 = beginT[1] + '月' + beginT[2] + '日' + beginT[3]  + ':' + beginT[4];
              that.$set(tab,'beginD',begin2);

              //重定义 结束时间 mm-dd-tt-bb
              let endT = that.formatTime(urlll[i].lessonLiveEndTime * 1000);
              let endT2 = endT[3]  + ':' + endT[4];
              that.$set(tab,'endD',endT2);

              // 倒计时
              urlll[i].currDatesNew = new Date().getTime() / 1000;
              urlll[i].cha = 30 * 60 ; //差值
              //倒计时赋值 小于30分钟时
              
              if(urlll[i].lessonLiveBeginTime - urlll[i].currDatesNew < tab.cha && urlll[i].currDatesNew < urlll[i].lessonLiveBeginTime) {
                tim(that,liveData[j]._live[i])
                
              }else{
                that.liveCouresLists = liveData;
              }
            //})(i);
          }
        }
        function tim(obj,tab){
          var timer = null;
                timer = setInterval(function() {
                  var currDates = new Date().getTime() / 1000; //当前时间
                  var str = obj.Interval(
                    that,
                    "InterStr",
                    tab.lessonLiveBeginTime
                  );
                  obj.$set(tab, "InterStr", str);
                  if(currDates > tab.lessonLiveBeginTime){
                      clearInterval(timer);
                      obj.$set(tab, 'currDatesNew', new Date().getTime() / 1000);
                      that.liveCouresLists = liveData;
                      that.$forceUpdate()
                      
                  }
                }, 1000);
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    //tabs
    toggleTabs(ind) {
      this.nowIndex = ind;
      this.liveCouresLists = this.liveCouresList;
    },
    // 倒计时
    Interval(obj, key, time) {
      //Interval (time){
      //1、获取课程开始时间
      var nextDate = time;
      // 2-1 获取现在时间
      var currDate = new Date().getTime() / 1000;
   
      // 2-3 剩余时间
      var allTime = nextDate - currDate;
      var m = this.size(parseInt((allTime / 60) % 24)); // 时
      var s = this.size(parseInt(allTime % 60)); //秒
      var timer = m + ":" + s;
      return timer;
    },

    // 时间小于 10时 加 0
    size(num){
      return num >= 10 ? num : '0' + num
    },

    // 定时器
    formatTime (time){
      var timestamp = new Date(time);
      var regTime = timestamp.toLocaleDateString().replace(/\//g, ":") + ":" + timestamp.toTimeString().substr(0, 5);
      var timerObj = regTime.split(':');
      return timerObj;
    },

    // 进入直播
    getLiveShow(id,classCode,lessonIndex){
      //this.room = this.$refs.roomid;
      let url = this.HOST + "/lessonLiveUrl";
      this.$axios.post(url,{
        room_id: id,
        class_code: classCode,
        lesson_index: lessonIndex
      }).then(res => {
        window.location.href=res.data.data.liveUrl;
        if(res.data.code == -1010){
          console.log('登录过期')
          this.$toast.center('登录已过期');
          this.$router.replace("/");
        }
      })
      .catch(error => {
          console.log(error);
          //console.log(1)
        });
      }
  },
  mounted() {
   
  }
};
</script>
<style scoped lang='less'>

.sectNoText {
  color: #8b8b8b;
  text-align: center;
  position: absolute;
  left: 0;
  top: 300px;
  width: 100%;
}

.live-body {
  background: #f6f6f6;
  position: relative;
  height: 100%;
}
.live-header {
  width: 100%;
  padding-bottom: 7px;
  background: #fff;
  border-bottom: 1px solid #dcdcdc;
  z-index: 999;
  h4 {
    font-size: 18px;
    line-height: 46px;
  }
  .tabs {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    li {
      border: 0.01rem solid #bdbdbd;
      color: #bdbdbd;
      border-radius: 0.3rem;
      padding: 0.07rem 0.15rem;
      margin: 0 0.1rem 0.15rem 0.1rem;
      float: left;
      text-align: left;
      cursor: pointer;
      &.current {
        border: 0.01rem solid #f07e4d;
        color: #f07e4d;
      }
    }
  }
}
.liveCoureList {
  background: #f6f6f6;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .title {
    padding-bottom: 7px;
    color: #feb900;
    position: relative;
    padding-bottom: 10px;
    margin-top: 10px;
    font-size: 16px;
    text-align: center;
    width: 100%;
    &:before,
    &:after {
      content: "/";
      padding: 0 7px;
    }
  }
  section {
    background: #fff;
    padding: 0.25rem 0.15rem 0.15rem 0.15rem;
    margin-bottom: 0.15rem;
    position: relative;
    min-height: 60px;
  }
  .hd {
    overflow: hidden;
    clear: both;
  }
  .box {
    display: block;
  }
}

.liveCoureList li {
  border-bottom: 0.01rem solid #cfcfcf;
  overflow: hidden;
  clear: both;
  padding: 0.15rem 0;
  line-height: 0.24rem;
}

.liveCoureList h4 {
  display: inline-block;
  padding-left: 0.1rem;
  font-weight: normal;
  font-size: 0.32rem;
  overflow: hidden;
}

.liveCoureList .flex {
  overflow: hidden;
  display: flex;
  align-items: center;
}
.liveCoureList .down {
  float: left;
  width: 1.7rem;
}
.liveCoureList .down a {
  padding: 0 0.1rem;
  color: #8b8b8b;
  display: inline-block;
  font-size: 0.24rem;
}

.liveCoureList .state {
  flex: 1;
  text-align: right;
}
.liveCoureList .state .icon {
  background: url(../assets/img/live-icon.png) no-repeat;
  background-size: .38rem auto;
  padding-left: .45rem;
  display: inline-block;
  font-size: 0.3rem;
}
.liveCoureList .state .backPlay {
  color: #feb900;
  background-position: 0 .02rem
}

.liveCoureList .state .goPlay {
  color: #24980e;
  background-position: 0 -0.63rem;
}

.liveCoureList .state .countDownPlay {
  color: #f03434;
  background-position: 0 -1.23rem;
}

.liveCoureList .state .time {
  color: #8b8b8b;
  background-position: 0 -1.83rem;
}
</style>