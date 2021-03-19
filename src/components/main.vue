<template>
  <div class="main_box">
      <a @click="linkTo('info')" class="info">
          <img src="../assets/btn_info.png" alt="">
      </a>
      <!-- <p v-if="!isStart">{{showTime}}</p> -->
      <a  @click="linkTo('hight')" class="start">
          <img src="../assets/btn_into.png" alt="">
      </a>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
export default {
    data(){
        return {
            //活动开始时间
            activeTime: new Date('2020-11-01 00:00:00'),
            //实现时间
            showTime: '',
            //是否开始
            isStart: false
        }
    },
    methods: {
        ...mapMutations(['setState']),
        //路由跳转
        linkTo(type){
            this.$router.push({
                path: type
            })
            if(type === 'hight'){
                this.setState({name: 'hightPlay', value: true});
                this.setState({name: 'mainPlay', value: false});
                this.setState({name: 'lowPlay', value: false});
                //显示控制
                this.setState({name: 'hightControl', value: true});
                this.setState({name: 'mainControl', value: false});
                this.setState({name: 'lowControl', value: false});
            }
        },
        //倒计时
        autoplay(){
            let loop =  () => {
                let timer = setTimeout( () => {
                    //当前时间
                    var startTime = new Date();
                    //算出中间差，以毫秒数返回.
                    var countDown = (this.activeTime.getTime()-startTime.getTime());
                    if(countDown > 0){
                        this.isStart = false;
                        //获取天数
                        var oDay = parseInt(countDown/1000/60/60/24);
                        //获取小时数
                        var oHour = parseInt(countDown/1000/60/60%24);
                        //获取分钟数
                        var oMinute = parseInt(countDown/1000/60%60);
                        //获取秒数
                        var oSecond = parseInt(countDown/1000%60);
                        this.showTime = `距离活动开始仅剩：${oDay}天${oHour}时${oMinute}分${oSecond}秒`;
                        clearTimeout(timer);
                        loop();
                    }else{
                        clearTimeout(timer);
                        this.isStart = true;
                    }
                }, 1000)
            }
            loop();
        }
    }

}
</script>

<style scoped lang="less">
.main_box{
    height: 100vh;
    width:  100%;
    background:#6B3632 url(../assets/main_bg.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 40vh;
    a.info{
        width: 80%;
        text-align: center;
        display: block;
        margin: 0px auto;
        img{
            max-width: 100%;
        }
    }
    a.start{
        display: block;
        margin: 0 auto;
        margin-top: 40px;
        width: 30%;
        img{
            max-width: 100%;
        }
    }
    p{
        margin-top: 50px;
        color: #fff;
    }
}
</style>
