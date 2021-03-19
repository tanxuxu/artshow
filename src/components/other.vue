<template lang="html">
  <div class="youxiu">
        <canvas width="1536" id="canvas1">你的浏览器不支持HTML5画布技术，请使用谷歌浏览器。</canvas>
        <!-- 鼠标滑动提示 -->
        <div class="tap_box" v-show="showTap"></div>
        <!-- 导航 -->
        <menuNav @searchImage="searchImage"/>
        <!-- 底部滑动 -->
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-bind:class="{'swiper-slide-active': index == viewIndex}" v-for="(v, index) in otherImage" @click="changeImage(index)"  :key="index">
                    <img :src="v.src" alt="">
                </div>
            </div>
        </div>
        <!-- 详情按钮 -->
        <transition name="fade">
            <span class="into" @click="gotoDetail()" v-if="showBtn"></span>
        </transition>
        <!-- 加载 -->
        <Spin fix v-if="spinShow" style="background-color: rgba(94,25,20,.8);">
          <Icon type="ios-loading" size=30 color="#F0FF00" class="demo-spin-icon-load"></Icon>
          <div style="color: #F0FF00; font-size: 12px; line-height: 40px;">正在加载作品资源...</div>
        </Spin>
        <!-- 弹出框 -->
        <imageModal :data="filterImages" ref="imageModal" @searchImage="searchImage" @gotoImage="gotoImage"/>
  </div>
</template>

<script>
/* eslint-disable */
import structure  from "@/components/structure_o.js";
import photo from "@/components/other.js";
// import { Swiper, SwiperSlide } from 'swiper/vue';
import Swiper from 'swiper';
import SwiperCss from "swiper/swiper.less";
import menuNav from "./nav.vue";
import imageModal from "./imageModal.vue";
import {mapState} from "vuex";

var diapo = [],
    layers = [],
    ctx,
    pointer,
    scr,
    camera,
    light,
    fps = 0,
    quality = [1,2],
    Poly,
    Diapo,
    init,
    run,
    swiper;

export default {
    components: {
        Swiper,
        menuNav,
        imageModal
        // SwiperSlide
    },
    computed:{
        ...mapState(['otherImage'])
    },
    watch: {
        curIndex(val){
            if(val == 100){
                this.spinShow = false;
            }
        }
    },
    mounted(){
        this.$nextTick( ()=>{
            let _data = this.initData(this.otherImage);
            this.render(_data);
            //轮播图
            swiper = new Swiper('.swiper-container', {
                slideToClickedSlide: true,
                centeredSlides : true,
                slidesPerView : 5,
                initialSlide: 2,
                spaceBetween: 5,
                on: {
                    slideChange: (e) => {
                        let _index = e.activeIndex;
                        camera.target.elem = diapo[_index];

                        if(camera.target.elem.normalX != -1 && camera.target.elem.normalX != 1){

                            camera.target.x = camera.target.elem.tx;
                            if(_index == 2){
                                camera.target.z = 0;
                                this.showBtn = false;
                            }
                            else{
                                if(camera.z > 0){
                                    camera.target.z = camera.target.elem.tz - 100;
                                }else{
                                    camera.target.z = camera.target.elem.tz + 100;
                                }
                                this.showBtn =  true;
                            }
                        }
                        //东北方向另外处理
                        else{
                            camera.target.x = camera.target.elem.normalX == -1? camera.target.elem.tx - 100 : camera.target.elem.tx + 100;
                            camera.target.z = camera.target.elem.tz;
                        }

                        this.curName = camera.target.elem.img.name;
                    }
                }
            });
        })
        //超时5s关闭loading
        let timer = setTimeout( () => {
            this.spinShow = false;
            this.showTap = false;
            clearTimeout(timer)
            timer = null;
        }, 1000 * 3)
    },
    data(){
        return {
            spinShow: false,
            color: 'rgba(255,255,255,0.8)',
            showBtn: false,  //显示按钮
            curName: '', //当前作品名称
            curIndex: 0, //当前渲染的索引值
            viewIndex: 0, //浏览索引值
            showTap: true,
            filterImages: [],

        }
    },
    methods: {
        //关键词
        searchImage(keyword){
            let _data = photo.filter(v => {
                return v.stu.includes(keyword) || v.title.includes(keyword) || v.qy.includes(keyword) || v.school.includes(keyword);
            });
            if(!_data.length){
                this.$Message.success('没有找到相关作品！');
            }
            if(_data.length === 1){
                let _index = photo.findIndex(v => v.id === _data[0].id);
                this.changeImage(_index);
                //关闭弹窗
                this.filterImages = [];
                this.$refs.imageModal.closeModal();
            }else{
                this.$refs.imageModal.openModal(keyword);
                //过滤图片
                this.filterImages = _data.map( v => {
                    return {
                        ...v,
                        img: require(`@/assets/image/${v.img_name}`),
                        img_big: require(`@/assets/image/${v.img_name.split(".")[0] + '_big'}.jpg`),
                    }
                })
            }
        },
        //筛选到某张图片
        gotoImage(id){
            let _index = photo.findIndex( v => v.id === id);
            this.changeImage(_index);
        },
        //切换图片
        changeImage(index){
            this.viewIndex = index;
            swiper.slideTo(index, 1000, false);
            camera.target.elem = diapo[index];

            if(camera.target.elem.normalX != -1 && camera.target.elem.normalX != 1){
                if(camera.target.elem.normalZ != 0){
                    if(camera.target.elem.tz > 0){
                        camera.target.z = camera.target.elem.tz - 100;
                    }else{
                        camera.target.z = camera.target.elem.tz + 100;
                    }
                }else{
                    camera.target.z = 0;
                }
            }else{
                camera.target.z = camera.target.elem.tz;
                camera.target.x = camera.target.elem.normalX == -1? camera.target.elem.tx - 100 : camera.target.elem.tx + 100;
            }

            this.showBtn =  true;
            this.curName = camera.target.elem.img.name;
        },
        //获取作品
        initData(image){
        /*    //北
            const getNorth = () => {
                let x = -23000;
                let y = 0;
                let _data = [];
                while ( x <= 23000) {
                    _data.push({img: image[y], x: x, y:0, z:1500, nx:0, nz:1, name: photo[y].id})
                    x = x + 1000;
                    y++;
                }
                return _data;
            }
            //南
            const getSourth = () => {
                let x = -23000;
                let y = 47;
                let _data = [];
                while (x <= 23000) {
                    _data.push({img: image[y], x: x,  y:0, z:-1500, nx:0, nz:-1, name: photo[y].id})
                    x = x+ 1000;
                    y++;
                }
                return _data;
            }

            //东
            const getEast = () => {
                let x = -1000;
                let y = 94;
                let _data = [];
                while (x <= 1000) {
                    _data.push({img: image[y], x:24000,  y:0, z: x, nx:-1, nz:0, name: photo[y].id});
                    x = x + 1000;
                    y++;
                }
                return _data;
            }
            //西部
            const getWest = () => {
                let x = -1000;
                let y = 97;
                let _data = [];
                while (x<= 1000) {
                    _data.push({img: image[y], x:-24000, y:0, z: x, nx:1, nz:0, name: photo[y].id})
                    x = x+ 1000;
                    y++;
                }
                return _data;
            }
            return [ ...getNorth(), ...getSourth(),...getEast(),  ...getWest()];*/

            return [
                // north
                {img: image[0], x:-8000, y:0, z:1500, nx:0, nz:1, name: 'MC068'},
                {img: image[1], x:-7000,     y:0, z:1500, nx:0, nz:1, name: 'MC069'},
                {img: image[2], x:-6000,     y:0, z:1500, nx:0, nz:1, name: 'MC070'},
                {img: image[3], x:-5000,     y:0, z:1500, nx:0, nz:1, name: 'MC071'},
                {img: image[4], x:-4000,     y:0, z:1500, nx:0, nz:1, name: 'MC072'},
                {img: image[5], x:-3000,     y:0, z:1500, nx:0, nz:1, name: 'MC073'},
                {img: image[6], x:-2000,     y:0, z:1500, nx:0, nz:1, name: 'MC074'},
                {img: image[7], x:-1000,     y:0, z:1500, nx:0, nz:1, name: 'MC075'},
                {img: image[8], x:0,     y:0, z:1500, nx:0, nz:1, name: 'MC076'},
                {img: image[9], x:1000,     y:0, z:1500, nx:0, nz:1, name: 'MC077'},
                {img: image[10], x:2000,     y:0, z:1500, nx:0, nz:1, name: 'MC078'},
                {img: image[11], x:3000,     y:0, z:1500, nx:0, nz:1, name: 'MC079'},
                {img: image[12], x:4000,     y:0, z:1500, nx:0, nz:1, name: 'MC080'},
                {img: image[13], x:5000,     y:0, z:1500, nx:0, nz:1, name: 'MC081'},
                {img: image[14], x:6000,     y:0, z:1500, nx:0, nz:1, name: 'MC082'},
                {img: image[15], x:7000,     y:0, z:1500, nx:0, nz:1, name: 'MC083'},
                {img: image[16], x:8000,     y:0, z:1500, nx:0, nz:1, name: 'MC084'},

                // south
                {img: image[17], x: -8000,  y:0, z:-1500, nx:0, nz:-1, name: 'MC085'},
                {img: image[18], x: -7000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC086'},
                {img: image[19], x: -6000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC087'},
                {img: image[20], x: -5000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC088'},
                {img: image[21], x: -4000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC089'},
                {img: image[22], x: -3000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC090'},
                {img: image[23], x: -2000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC091'},
                {img: image[24], x: -1000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC092'},
                {img: image[25], x:0,     y:0, z:-1500, nx:0, nz:-1, name: 'MC093'},
                {img: image[26], x: 1000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC094'},
                {img: image[27], x: 2000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC095'},
                {img: image[28], x: 3000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC096'},
                {img: image[29], x: 4000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC097'},
                {img: image[30], x: 5000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC098'},
                {img: image[31], x: 6000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC099'},
                {img: image[32], x: 7000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC100'},
                {img: image[33], x: 8000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC101'},
                {img: image[34], x: 9000,     y:0, z:-1500, nx:0, nz:-1, name: 'MC102'},

                // east
                {img: image[35], x: 10000,  y:0, z: -1000, nx:-1, nz:0, name: 'MC103'},
                {img: image[36], x: 10000,  y:0, z:0, nx:-1, nz:0, name: 'MC104'},
                {img: image[37], x: 10000,  y:0, z: 1000, nx:-1, nz:0, name: 'MC105'},

                // west
                {img: image[38], x:-9000, y:0, z:-1000, nx:1, nz:0, name: 'MC106'},
                {img: image[39], x:-9000, y:0, z:0, nx:1, nz:0, name: 'MC107'},
                {img: image[40], x:-9000, y:0, z: 1000, nx:1, nz:0, name: 'MC108'},
            ]

        },
        //查看图片详情
        gotoDetail(){
            this.curName && this.$router.push({
                path: `/detail?name=${this.curName}&type=other`
            })
        },
        //渲染图片
        render(data = []){
            //debugger
            let _this = this;
            /* ==== definitions ==== */
            // ---- poly constructor ----
            Poly = function (parent, face) {
                this.parent = parent;
                this.ctx    = ctx;
                this.color  = face.fill || false;
                this.points = [];
                if (!face.img) {
                    // ---- create points ----
                    for (var i = 0; i < 4; i++) {
                        this.points[i] = new ge1doot1.transform3D.Point(
                            parent.pc.x + (face.x[i] * parent.normalZ) + (face.z[i] * parent.normalX),
                            parent.pc.y +  face.y[i],
                            parent.pc.z + (face.x[i] * parent.normalX) + (-face.z[i] * parent.normalZ)
                        );
                    }
                    this.points[3].next = false;
                }
            };
            // ---- 创建Diapo 图片链接路径   图片地址  相框
            Diapo = function (path, img, structure) {
                //debugger
                // ---- create image ----
                this.img = new ge1doot1.transform3D.Image(
                    this,
                    img.name,
                    img.img,
                    1,
                    {
                        isLoaded: function(img) {
                            img.parent.isLoaded = true;
                            img.parent.loaded(img);
                        }
                    }
                );
                this.visible  = false;
                this.normalX  = img.nx;
                this.normalZ  = img.nz;
                // ---- 中心点 ----
                this.pc = new ge1doot1.transform3D.Point(img.x, img.y, img.z);
                // ---- 目标位置 ----
                this.tx = img.x + (img.nx * Math.sqrt(camera.focalLength) * 20);
                this.tz = img.z - (img.nz * Math.sqrt(camera.focalLength) * 20);
                // ---- 创建多边形 ----
                this.poly = [];
                for (var i = -1, p; p = structure[++i];) {
                    layers[i] = (p.img === true ? 1 : 2);
                    this.poly.push(
                        new Poly(this, p)
                    );
                }
            };
            // ---- init section ----
            init = function (data) {
                // console.time('a');
                // 绘制多边形
                Poly.prototype.drawPoly = ge1doot1.transform3D.drawPoly;
                // ---- 初始化画布 ----
                scr = new ge1doot1.Screen({
                    container: "canvas1"
                });
                ctx = scr.ctx;
                scr.resize();

                // ---- 初始化点 ----
                pointer = new ge1doot1.Pointer({
                    //触摸点事件
                    tap: function (e) {
                        //点中图片
                        if (camera.over) {
                            //同一张图片切换
                            if (camera.over === camera.target.elem) {

                                if(camera.target.elem.normalX != -1 && camera.target.elem.normalX != 1){
                                    if(camera.target.z === 0){
                                        //拉近
                                        _this.showBtn = true;
                                        _this.curName = camera.target.elem.img.name;

                                         if(camera.target.elem.normalZ == 0){
                                             setTimeout( () => {
                                                  camera.target.z = 100;
                                             });
                                         }else{
                                             if(camera.over.tz > 0){
                                                 camera.target.z = camera.over.tz - 100;
                                             }else{
                                                 camera.target.z = camera.over.tz + 100;
                                             }

                                         }
                                    }else{
                                        //拉远
                                        _this.showBtn = false;

                                        if(camera.target.elem.normalZ == 0){
                                            setTimeout( () => {
                                                camera.target.z = 1000;
                                            })
                                        }else if(camera.target.elem.normalZ == -1){
                                            setTimeout( () => {
                                                camera.target.z = 0;
                                            })
                                        }
                                        else if(camera.target.elem.normalZ == 1){
                                            setTimeout( () => {
                                                camera.target.z = 0;
                                            })
                                        }
                                    }
                                }
                                //东西方向的特殊处理
                                else{
                                    camera.target.z = camera.target.elem.tz;
                                    if(camera.target.x == 0){
                                        _this.showBtn =  true;
                                        camera.target.x = camera.target.elem.normalX == -1? camera.target.elem.tx - 100 : camera.target.elem.tx + 100;
                                    }else{
                                        camera.target.x = 0;
                                        _this.showBtn = false;
                                    }
                                }
                            }
                            //切换另一张
                            else {
                                camera.target.elem = camera.over;
                                //解决切换图片后被放大的问题
                                let timer = setTimeout( () => {
                                    if(camera.target.elem.normalX != -1 && camera.target.elem.normalX != 1){
                                        if(camera.target.elem.normalZ != 0){
                                            if(camera.target.elem.tz > 0){
                                                camera.target.z = camera.target.elem.tz - 100;
                                            }else{
                                                camera.target.z = camera.target.elem.tz + 100;
                                            }
                                        }else{
                                            camera.target.z = 0;
                                        }
                                    }
                                    //东北方向特殊处理
                                    else{
                                        camera.target.z = camera.target.elem.tz;
                                        camera.target.x = camera.target.elem.normalX == -1? camera.target.elem.tx - 100 : camera.target.elem.tx + 100;
                                    }

                                    clearTimeout(timer);
                                    timer = null;
                                })
                                //camera.target.x = camera.over.tx;
                                // ---- 根据距离调整级别 ----
                               for (var i = 0, d; d = diapo[i++];) {
                                    var dx = camera.target.x - d.pc.x;
                                    var dz = camera.target.z - d.pc.z;
                                    var dist = Math.sqrt(dx * dx + dz * dz);
                                    var lev = (dist > 1500) ? quality[0] : quality[1];
                                    d.img.setLevel(lev);
                                }

                                //显示进入按钮
                                _this.showBtn = true;
                                _this.curName = camera.target.elem.img.name;

                                let _index = photo.findIndex(v => v.id === _this.curName);
                                swiper.slideTo(_index, 1000, false);
                                 _this.viewIndex = _index;
                            }
                        }
                    }
                });
                // ---- 初始化相机 ----
                camera = new ge1doot1.transform3D.Camera({
                    focalLength: Math.sqrt(scr.width) * 10,
                    easeTranslation: 0.5,
                    easeRotation: 0.26,
                    disableRz: false
                }, {
                    move: function () {
                        this.over = false;
                        // ---- rotation ----
                        if (pointer.isDraging) {
                            this.target.elem = false;
                            this.target.ry = -pointer.Xi * 0.01;
                            this.target.rx = (pointer.Y - scr.height * 0.5) / (scr.height * 0.5);
                        } else {
                            if (this.target.elem) {
                                this.target.ry = Math.atan2(
                                    this.target.elem.pc.x - this.x,
                                    this.target.elem.pc.z - this.z
                                );
                            }
                        }
                        this.target.rx *= 0.9;
                    }
                });
                camera.z  = -10000;
                camera.py = 0;
                // ---- 创建图片 ----
                diapo = [];
                for (var i = 0, img; img = data[i++];) {
                    diapo.push(
                        new Diapo(
                            '',  //json.options.imagesPath,
                            img,
                            structure
                        )
                    );
                }
                // ---- start engine ---- >>>
                setInterval(function() {
                    quality = (fps > 50) ? [2,3] : [1,2];
                    fps = 0;
                }, 1000);
                run();
            };
            // ----运行函数 ----
            run = function () {
                // ---- 清除画布 ----
                //debugger
                ctx.clearRect(0, 0, scr.width, scr.height);
                // ---- 清除相机 ----
                camera.move();
                // ---- draw layers ----
                for (var k = -1, l; l = layers[++k];) {
                    light = false;
                    for (var i = 0, d; d = diapo[i++];) {
                        (l === 1 && d.draw()) ||
                        (d.visible && d.poly[k].draw());
                    }
                }
                // ---- 鼠标状态设置 ----
                if (camera.over && !pointer.isDraging) {
                    scr.setCursor("pointer");
                } else {
                    scr.setCursor("move");
                }
                // ---- loop ----
                fps++;
                requestAnimFrame(run);
            };
            /* ==== prototypes ==== */
            Poly.prototype.draw = function () {
                // ---- color light ----
                var c = this.color;
                if (c.light || !light) {
                    var s = c.light ? this.parent.light : 1;
                    // ---- rgba color ----
                    light = "rgba(" +
                        Math.round(c.r * s) + "," +
                        Math.round(c.g * s) + "," +
                        Math.round(c.b * s) + "," + (c.a || 1) + ")";
                    ctx.fillStyle = light;
                }
                // ---- paint poly ----
                if (!c.light || this.parent.light < 1) {
                    // ---- projection ----
                    for (
                        var i = 0;
                        this.points[i++].projection();
                    );
                    this.drawPoly();
                    ctx.fill();
                }
            }
            /* ==== 图片加载函数==== */
            Diapo.prototype.loaded = function (img) {
                // ---- create points ----
                var d = [-1,1,1,-1,1,1,-1,-1];
                var w = img.texture.width  * 0.5;
                var h = img.texture.height * 0.5;
                for (var i = 0; i < 4; i++) {
                    img.points[i] = new ge1doot1.transform3D.Point(
                        this.pc.x + (w * this.normalZ * d[i]),
                        this.pc.y + (h * d[i + 4]),
                        this.pc.z + (w * this.normalX * d[i])
                    );
                }
                if(_this.curIndex < 100){
                    _this.curIndex ++;
                }
            }
            /* ==== 图片绘制 ==== */
            Diapo.prototype.draw = function () {
                // ---- visibility ----
                this.pc.projection();
                if (this.pc.Z > -(camera.focalLength >> 1) && this.img.transform3D(true)) {
                    // ---- 光源 ----
                    this.light = 0.9;   //0.5 + Math.abs(this.normalZ * camera.cosY - this.normalX * camera.sinY) * 0.6;
                    // ---- 图片 ----
                    this.visible = true;
                    this.img.draw();
                    // ---- test pointer inside ----
                    let isInPointer = this.img.isPointerInside(pointer.X, pointer.Y);
                    //pointer.hasMoved 正在拖动
                    //pointer.isDown  按压状态
                    if (pointer.hasMoved || pointer.isDown) {
                        if (isInPointer){
                            camera.over = this;
                        }
                    }
                    //显示按钮
                    //let {visible, img} = camera.target.elem;
                    //判断是否显示按钮
                    // _this.showBtn = visible;
                //    if(img && img.name){
                    //    _this.curName = img.name;
                //    }
                } else {
                    this.visible = false;
                }
                return true;
            }
            //初始化加载
            init(data);
        }
    }
}
</script>

<style lang="less" scoped>
.youxiu{
    width: 100%;
    height:  100vh;
    background: #fff;
    position: relative;
    display: flex;
   .demo-spin-icon-load{
       animation: ani-demo-spin 3s linear infinite;
   }
   @keyframes ani-demo-spin {
       from { transform: rotate(0deg);}
       50%  { transform: rotate(180deg);}
       to   { transform: rotate(360deg);}
   }
    #canvas1{
        width: 100%;
        flex: 1;
        background:#fff;
        position: relative;
        top: -10%;
    }
    //滑动提示
    .tap_box{
        width:80px;
        height: 80px;
        background: rgba(0,0,0,0.5) url(../assets/tap_ico.png) center center;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 10;
        margin-top: -40px;
        margin-left: -40px;
        background-size: 76px 60px;
        background-repeat: no-repeat;
    }
    //底部滑动
    .swiper-container{
        height: 70px;
        position: fixed;
        width: 100%;
        bottom: 50px;
        background: #000;
        padding: 5px;
        .swiper-slide{
            // width: 80px !important;
            height: 60px;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid #fff;
            &.swiper-slide-active{
                border: 2px solid #f00;
            }
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
    .into{
        width: 72px;
        height: 45px;
        background: url(../assets/btn_into_1.png);
        display: block;
        position: fixed;
        bottom: 126px;
        left: 50%;
        margin-left: -36px;
        z-index: 10;
        background-size: contain;
        background-repeat: no-repeat;
    }
    .btn_left, .btn_right{
        display: block;
        position: fixed;
        z-index: 10;
        color: #fff;
        font-size: 40px;
        bottom: 60px;
    }
    .btn_left{
        left: 5%;
    }
    .btn_right{
        right: 5%;
    }
}
</style>
