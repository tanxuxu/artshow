<template>
  <div id="app">
      <div class="bar" v-show="!hideBar" :class="{'black': color == '#fff', 'white': color == '#000' }">
          <Icon @click="back()" type="ios-arrow-dropleft-circle" :color="color" size='46'/>
      </div>
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
      <!-- 主音乐控制 -->
      <span v-show="mainControl" @click="playAudio('main')" v-bind:class="{'play': mainPlay, 'pic_music': true}">
          <Icon type="md-musical-note" color="#fff" :size="24"/>
          <i class="line" v-show="!mainPlay"></i>
      </span>
      <!-- 高年级音乐控制 -->
      <span v-show="hightControl" @click="playAudio('hight')" v-bind:class="{'play': hightPlay, 'pic_music': true}">
          <Icon type="md-musical-note" color="#fff" :size="24"/>
          <i class="line" v-show="!hightPlay"></i>
      </span>
      <!-- 低年级音乐控制 -->
      <span v-show="lowControl" @click="playAudio('low')" v-bind:class="{'play': lowPlay, 'pic_music': true}">
          <Icon type="md-musical-note" color="#fff" :size="24"/>
          <i class="line" v-show="!lowPlay"></i>
      </span>
      <!-- 全局音乐 -->
      <audio id="mainMp3" loop="loop" style="opacity: 0;">
          <source :src="mainMp3" type="audio/mpeg">
      </audio>
      <!-- 高年级介绍 -->
      <audio id="hightMp3" loop="loop"  style="opacity: 0;">
          <source :src="hightMp3" type="audio/mpeg">
      </audio>
      <!-- 低年级介绍 -->
      <audio id="lowMp3" loop="loop" style="opacity: 0;">
          <source :src="lowMp3" type="audio/mpeg">
      </audio>
      <!-- 序语 -->
      <xuyuModal ref="xuyuModal" @closeXuyu="closeXuyu"/>
      <span class="xuyu_btn" v-show="showxuyuBtn" @click="openModalXuyu">序言</span>
  </div>
</template>
<script>
/* eslint-disable */
import photo from "@/components/photo.js"
import other from "@/components/other.js";
import xuyuModal from "@/components/xuyuModal.vue";
import {mapState, mapMutations} from "vuex"
export default {
  name: 'App',
  components: {
      xuyuModal
  },
  computed: {
      ...mapState(['isFirst', 'mainPlay', 'hightPlay', 'lowPlay', 'mainControl', 'hightControl', 'lowControl'])
  },
  created(){
      let image = [];
      let index = 0;

      let image1 = [];
      let index1 = 0;

      const images = photo.map(v => {
          return  require(`@/assets/image/${v.img_name}`);
      })

      const images1 = other.map( v => {
          return  require(`@/assets/image/${v.img_name}`);
      })

      for (const key in images) {
           // 创建image对象
           image[index] = new Image();
           // 把图片地址赋值
           if (images.hasOwnProperty(key)) {
               const img = images[key];
               image[index].src = img;
           }
           index ++;
      }
      //图片预加载
      this.setState({name: 'artImage', value: image});

      for (const key in images1) {
           // 创建image对象
           image1[index1] = new Image();
           // 把图片地址赋值
           if (images1.hasOwnProperty(key)) {
               const img = images1[key];
               image1[index1].src = img;
           }
           index1 ++;
      }
      this.setState({name: 'otherImage', value: image1});
  },
  watch: {
      '$route': {
          immediate: true,
          handler(val){
              this.hideBar = val.meta.hideBar;
              this.color =  '#000';
              if(val.name === 'hight' && this.isFirst){
                  this.$nextTick( () => {
                      this.$refs.xuyuModal.openModal();
                      this.setState({name: 'isFirst', value: false})
                  })
              }
              else if(val.name === 'hight'){
                  //按钮控制显示
                  this.setState({name: 'mainControl', value: false});
                  this.setState({name: 'hightControl', value: true});
                  this.setState({name: 'lowControl', value: false});
                  //播放控制
                  this.setState({name: 'mainPlay', value: false});
                  this.setState({name: 'hightPlay', value: true});
                  this.setState({name: 'lowPlay', value: false});
              }else if(val.name === 'low'){
                  //显示控制
                  this.setState({name: 'mainControl', value: false});
                  this.setState({name: 'hightControl', value: false});
                  this.setState({name: 'lowControl', value: true});
                  //播放控制
                  this.setState({name: 'mainPlay', value: false});
                  this.setState({name: 'hightPlay', value: false});
                  this.setState({name: 'lowPlay', value: true});
              }else if(val.name === 'main'){
                  //显示控制
                  this.setState({name: 'mainControl', value: true});
                  this.setState({name: 'hightControl', value: false});
                  this.setState({name: 'lowControl', value: false});
                  //播放控制
                  this.setState({name: 'mainPlay', value: true});
                  this.setState({name: 'hightPlay', value: false});
                  this.setState({name: 'lowPlay', value: false});
              }
          }
      },
      //主音频
      mainPlay: {
          immediate: true,
          handler(val){
              this.$nextTick( () => {
                  let _audio = document.getElementById('mainMp3');
                  if(val){
                      _audio.play();
                  }else{
                      _audio.pause();
                  }
              })
          }
      },
      //高年级
      hightPlay: {
          immediate: true,
          handler(val){
              this.$nextTick( () => {
                  let _audio = document.getElementById('hightMp3');
                  if(val){
                      _audio.play();
                  }else{
                      _audio.pause();
                  }
              })
          }
      },
      //低年级
      lowPlay: {
          immediate: true,
          handler(val){
              this.$nextTick( () => {
                  let _audio = document.getElementById('lowMp3');
                  if(val){
                      _audio.play();
                  }else{
                      _audio.pause();
                  }
              })
          }
      }
  },
  data(){
      return {
          hideBar: true,
          color: '#000',
          mainMp3: require('@/assets/info.mp3'),
          hightMp3: require('@/assets/hight.mp3'),
          lowMp3: require('@/assets/low.mp3'),
          play: false,
          showxuyuBtn: false
      }
  },
  methods:{
      ...mapMutations(['setState']),
      //打开序语
      openModalXuyu(){
          this.$refs.xuyuModal.openModal();
          this.showxuyuBtn = false;
      },
      closeXuyu(){
          this.showxuyuBtn =  true;
      },
      back(){
          this.$router.go(-1);
      },
      playAudio(name){
          if(name === 'main'){
              this.setState({name: 'mainPlay', value: !this.mainPlay});
          }
          else if(name === 'hight'){
              this.setState({name: 'hightPlay', value: !this.hightPlay});
          }
          else if(name === 'low'){
              this.setState({name: 'lowPlay', value: !this.lowPlay});
          }
      }
  }
}
</script>
<style lang="less" scoped>
body,html{
    padding:0px;
    margin:0px;
}
@keyframes move{
    from {
         transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 960px;
  margin: 0 auto;
      .bar{
          width: 30px;
          height: 30px;
          border-radius: 50%;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 10;
          display: flex;
          left: 20px;
          top: 20px;
          &.white{
              background: #fff;
          }
          &.black{
              background: #000;
          }
      }
      .pic_music{
          position: fixed;
          right: 10px;
          top: 10px;
          z-index: 10;
          width: 40px;
          height: 40px;
          background: #5E1914;
          box-sizing: border-box;
          // border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          .line{
              width: 36px;
              height: 2px;
              background: rgba(255, 255, 255, 0.3);
              display: block;
              position: absolute;
              left: 0px;
              top: 16px;
              z-index: 10;
          }
          &.play{
               animation: move 5s linear infinite;
          }
      }
      .xuyu_btn{
          position: fixed;
          right: 60px;
          top: 10px;
          z-index: 10;
          width: 40px;
          height: 40px;
          background: #808695;
          box-sizing: border-box;
          // border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          color: #fff;
      }
}
</style>
