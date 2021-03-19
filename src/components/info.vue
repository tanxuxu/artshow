<template lang="html">
    <div class="info_box">
        <div class="content">
            <img src="../assets/info/info__01.jpg" alt="">
            <img src="../assets/info/info__02.jpg" alt="">
            <img src="../assets/info/info__03.jpg" alt="">
            <img src="../assets/info/info__04.jpg" alt="">
            <img src="../assets/info/info__05.jpg" alt="">
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    watch:{
        '$route.path': {
            immediate:true,
            handler(val){
                this.autoplay();
            }
        }
    },
    data(){
        return {
            color: 'rgba(0,0,0,0.8)',
        }
    },
    methods: {
        autoplay(){
            let play = () => {
                let timer = setTimeout( () => {
                    let top = $('.info_box').scrollTop();
                    if($('.info_box')[0] && top < $('.info_box')[0].scrollHeight){
                        let index = top + 1;
                        $('.info_box').scrollTop(index);
                        play();
                    }
                    clearTimeout(timer);
                    timer = null;
                }, 40);
            }
            this.$nextTick( () => {
                //进来1s后开始播放
                $('.info_box').scrollTop(0);
                let timer = setTimeout( () =>{
                    play();
                    clearTimeout(timer);
                    timer = null;
                }, 2000);
            //    $('#audio')[0] && ($('#audio')[0].currentTime = 0);
                //$('#audio')[0] && $('#audio')[0].play();
            })
        }
    },
};
</script>

<style lang="less" scoped>
img{
    max-width: 100%;
}
.info_box{
    height: 100vh;
    width: 100%;
    position: relative;
    overflow-y: auto;
}

</style>
