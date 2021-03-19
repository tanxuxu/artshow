<template lang="html">
  <div class="detail_box">
      <!-- 图片放大 -->
      <div class="images"  v-viewer="{
        navbar: false,
        url: 'data-source'}">
            <img :src="curWork.img" :data-source="curWork.img_big" :alt="curWork.title">
      </div>
      <!-- 分享 -->
      <shareModal :data="curWork" :info="info" ref="shareModal"/>
      <!-- 画作信息 -->
      <div class="info_box">
          <div class="info_l">
              <h3>{{curWork.title}}</h3>
              <p>{{curWork.qy}}</p>
              <p>{{curWork.school}}</p>
          </div>
          <ul class="info_r">
              <li v-for="v in info" :key="v.code" @click="clickImageHandler(v.code)">
                  <span v-if="v.code === 'see'">
                      <Icon type="ios-eye" size="28" color="#2E2E2E"/>
                  </span>
                  <span v-if="v.code === 'takeLike'" style="position: relative; top: 2px;">
                      <Icon type="ios-heart" size="22" color="#2E2E2E"/>
                  </span>
                  <span v-if="v.code === 'share'">
                      <!--<Icon type="ios-send-outline" v-if="!v.active" size="28" color="#6B3632"/>
                      <Icon type="ios-send" v-else size="28" color="#6B3632"/>-->
                      <img src="../assets/share_btns.gif" alt="">
                  </span>
                  <p>{{v.count}}</p>
              </li>
          </ul>
      </div>
      <p class="author">
          <span>{{curWork.class}}</span>
          <span>作者：{{curWork.stu}}</span>
      </p>
      <!-- 学生寄语 -->
      <div class="media_box">
          <h2>画作介绍</h2>
        <!--   <video controls name="media" width="100%" height="100%">
               <source src="https://elantra.beijing-hyundai.com.cn/assets/video/Elantra/tvc8.mp4" type="video/mp4">
           </video>-->
           <audio @play="onPlay" controls name="media" width="100%" id="myAudio" height="100%" style="margin: 10px auto;display: block;" v-if="curWork.audio">
               <source :src="curWork.audio" type="audio/mpeg">
           </audio>
           {{curWork.indroduce}}
      </div>
      <!-- 分享 -->
      <img :src="icon_bottom" class="icon_bottom" @click="share()">
  </div>
</template>

<script>
/* eslint-disable */
import photo from "@/components/photo.js";
import other from "@/components/other.js";
import shareModal from "./shareModal.vue";
import axios from "axios";
import {mapMutations} from "vuex";
export default {
    components: {
        shareModal
    },
    data(){
        return {
            color: 'rgba(0,0,0,0.8)',
            curWork: null,  //当前作品
            icon_bottom: require('@/assets/bottom.png'),
            info: [{
                code: 'see',
                count: 0,
                active: false
            },{
                code: 'takeLike',
                count: 0,
                active: false
            },{
                code: 'share',
                count: 0,
                active: false
            }]
        }
    },
    watch: {
        '$route.query':{
            immediate: true,
            handler(val){
            //    debugger
                let name = val.name;
                if(!name) return;
                let item = null;
                let type = val.type;
                if(type == 'youxiu'){
                    item = photo.find( v => v.id === name);
                }else{
                    item = other.find(v => v.id === name);
                }
                this.curWork = null;
                if(item){
                    let audio = item.video_name?  require(`@/assets/audio/${item.video_name}`) : null;
                    this.curWork = {
                        ...item,
                        img: require(`@/assets/image/${item.img_name}`),
                        img_big: require(`@/assets/image/${item.img_name.split(".")[0] + '_big'}.jpg`),
                        audio
                    }
                    this.$nextTick( () => {
                        let myAudio = document.getElementById('myAudio');
                        myAudio.load();
                        myAudio.pause();
                    })
                    //查询查看数，点赞数
                    axios.get('http://8.136.103.90:7089/draw/getViewCount', {
                        params: {
                            id: name
                        }
                    })
                    .then( _val => {
                        _val = _val.data;
                        this.info = this.info.map( v => {
                            if(v.code === 'see'){
                                v.count = _val.see || 0;
                            }
                            else if(v.code === 'takeLike'){
                                v.count = _val.takeLike || 0;
                            }
                            else if(v.code === 'share'){
                                v.count = _val.share || 0;
                            }
                            return v;
                        })
                    })
                    .catch( () => {
                        throw new Error('查询详情异常!');
                    })
                }
            }
        }
    },
    methods: {
        ...mapMutations(['setState']),
        onPlay(e){
            // console.log(e);
            if(e.type === 'play'){
                let _type = this.$route.query.type;
                if(_type === 'youxiu'){
                    this.setState({name: 'hightPlay', value: false});
                }else {
                    this.setState({name: 'lowPlay', value: false});
                }
            }
        },
        share(){
            window.open(`https://ssl.gongyi.qq.com/m/weixin/detail.htm?et=thxqr&pid=1000024329&parent1=68541EAF0D61B9A9F9D3DC8A1AE0CDDE6F90A935666218A5C35DCCDBCA312CFBE35062FC3FC854ABB0451968C1A8D0F8`, '_blank');
        },
        clickImageHandler(code){
            //分享
            if(code === 'share'){
                axios.get('http://8.136.103.90:7089/draw/incrCount', {
                    params: {
                        id: this.$route.query.name,
                        type: 'share'
                    }
                })
                .then( _val => {
                    if(_val.status == 200){
                        console.log('分享成功！');
                        this.info = this.info.map(v => {
                            if(v.code === 'share'){
                                 v.active = true;
                                 v.count ++;
                            }
                            return v;
                        })
                    }
                })
                /*this.$router.push({
                    path: `/share?name=${this.curWork.id}`
                })*/
                this.$refs.shareModal.openModal();
            }
            //点赞
            else if(code === 'takeLike'){
                axios.get('http://8.136.103.90:7089/draw/incrCount',{
                    params: {
                        id: this.$route.query.name,
                        type: 'takeLike'
                    }
                })
                .then( _val => {
                    if(_val.status == 200){
                        this.$Message.success('点赞成功！');
                        this.info = this.info.map( v => {
                            if(v.code === 'takeLike'){
                                v.count ++;
                                v.active = true;
                            }
                            return v;
                        })
                    }

                })
                .catch( () => {
                    alert('点赞异常!');
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.detail_box{
    padding-bottom: 100px;
    .icon_bottom{
        position: fixed;
        bottom: 0px;
        max-width: 100%;
        z-index: 10;
    }
    .media_box{
        padding: 10px;
        text-align: left;
        .no_data{
            font-size: 12px;
            line-height: 60px;
            color: #999;
            text-align: center;
        }
        h2{
            border-left: 4px solid #6B3632;
            padding-left: 10px;
            font-size: 14px;
            height: 16px;
            line-height: 16px;
            margin-bottom: 5px;
            font-weight: normal;
        }
        p{
            font-size: 14px;
            line-height: 24px;
            text-indent: 2em;
        }
    }
    img{
        max-width: 100%;
    }
    .avatar{
        display: flex;
        align-items: center;
        padding: 0px 10px;
        border-bottom: 1px solid #ddd;
        padding: 10px;
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        h4{
            font-size: 14px;
            padding-left: 10px;
        }
    }
    .author{
        display: flex;
        justify-content: space-between;
        margin: 0px 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }
    .info_box{
        padding: 10px 10px 0px;
        display: flex;
        .info_l{
            text-align: left;
            h3{
                color: #6B3632;
                font-size: 14px;
            }
            p{
                font-size: 14px;
                line-height: 24px;
            }
        }
        .info_r{
            display: flex;
            flex: 1;
            justify-content: flex-end;
            li{
                display: flex;
                flex-direction: column;
                padding: 0px 3px;
                span{
                    width: 30px;
                    height: 22px;
                    display: block;
                    line-height: 30px;
                }
                p{
                    font-size: 12px;
                    color: #6B3632;
                }
            }
        }
    }
}
</style>
