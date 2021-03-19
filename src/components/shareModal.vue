<template lang="html">
  <div class="share_box" v-show="showModal">
      <Spin size="large" fix v-if="spinShow" style="background: rgba(0,0,0,0.5)"></Spin>
      <div id="share_box" v-show="showImage"></div>
      <div class="image_wrap" id="imageBox" v-show="!showImage">
          <img src="../assets/share_detail_03.jpg" alt="">
          <div class="zuopin_box">
              <img :src="data.img" alt="">
              <p class="title">{{data.title}}</p>
              <p class="name_class">
                  <span>{{data.class}}</span>
                  <span>作者：{{data.stu}}</span>
              </p>
              <p class="school">{{data.school}}</p>
          </div>
          <img src="../assets/share_detail_06.jpg" alt="">
      </div>
      <div class="add_up">
          <ul>
              <li>点赞：{{takeLike}}</li>
              <li>热度：{{see}}</li>
          </ul>
          <a @click="addUp()">点赞 +1</a>
          <p>长按保存图片转发朋友圈，为作品集赞</p>
      </div>
      <!-- 关闭 -->
      <a class="close" @click="closeModal()"><Icon type="md-close" size="20" color="#fff"/></a>
  </div>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";
export default {
    props: ['data', 'info'],
    watch: {
        info(val){
            this.takeLike = val.find(v => v.code == 'takeLike')['count'];
            this.see = val.find(v => v.code == 'see')['count'];
        }
    },
    data(){
        return {
            showModal: false,
            spinShow: false,
            takeLike: 0,
            see: 0,
            showImage: false
        }
    },
    methods: {
        openModal(){
            this.showModal = true;
            this.showImage = false;
            this.$nextTick( () => {
                this.createImage();
            })
        },
        closeModal(){
            this.showModal = false;
        },
        //点赞
        addUp(){
            axios.get('http://8.136.103.90:7089/draw/incrCount',{
                params: {
                    id: this.$route.query.name,
                    type: 'takeLike'
                }
            })
            .then( _val => {
                if(_val.status == 200){
                    this.$Message.success('点赞成功！');
                    this.takeLike ++;
                }

            })
            .catch( () => {
                alert('点赞异常!');
            })
        },
        //创建图片
        createImage(){
            this.spinShow = true;
            html2canvas(document.querySelector("#imageBox"), {
                useCORS: true,
                allowTaint: true
            })
            .then(canvas => {
                let oImg = new Image();
                oImg.src = canvas.toDataURL();  // 导出图片
                oImg.style.maxWidth = '100%';//document.getElementById('imageBox').width;
                //oImg.style.height = document.getElementById('imageBox')[0].height;
                oImg.id = 'SHARE_IMAGE';
                document.querySelector('#share_box').innerHTML = '';
                document.querySelector('#share_box').append(oImg);
                //生成功能后再关闭loading
                this.spinShow = false;

                this.showImage = true;
            });
        }
    }
}
</script>

<style lang="less" scoped>
.share_box{
    position: fixed;
    background: rgba(0,0,0,0.6);
    z-index: 11;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right:0px;
    .close{
        position: fixed;
        right: -40px;
        top: -40px;
        display: block;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 40px;
        z-index: 12;
        background: #000;
        border-radius: 50%;
        i{
            position: relative;
            right: 15px;
            top: 35px;
        }
    }
    .image_wrap, #share_box{
        // height: calc(~'100% - 120px');
        width: 80%;
        background: #fff;
        margin: 20px auto;
        border-radius: 10px;
        overflow: hidden;
        padding: 8px;
        img{
            width: 100%;
        }
        .zuopin_box{
            p{
                text-align: left;
                font-size: 12px;
            }
            .title{
                font-weight: bold;
            }
            .name_class{
                display: flex;
                justify-content: space-between;
                font-weight: bold;
            }
        }
    }
    .add_up{
        height: 90px;
        background: rgba(0,0,0,0.9);
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        ul{
            display: flex;
            justify-content: center;
            li{
                margin:5px 10px;
                color: #fff;
            }
        }
        a{
            width: 60%;
            height: 30px;
            line-height: 30px;
            background: #FF5E89;
            color: #fff;
            text-align: center;
            font-size: 14px;
            display: block;
            margin: 0px auto;
            border-radius: 25px;
        }
        p{
            color: #fff;
            font-size: 14px;
            line-height: 30px;
            text-align: center;
        }
    }
}
</style>
