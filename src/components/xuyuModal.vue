<template lang="html">
    <!-- 序语弹窗 -->
    <div class="xuyu_modal" v-if="showModal">
        <div class="content">
            <span  class="close_btn" @click="closeModal()"></span>
            <img :src="img" alt="">
        </div>
        <div class="mask_box">

        </div>
    </div>
</template>

<script>
import img from '@/assets/xuyan.png';
export default {
    data(){
        return {
            showModal: false,
            img
        }
    },
    methods: {
        openModal(){
            this.showModal = true;
        },
        closeModal(){
            this.showModal = false;
            this.$emit('closeXuyu');
        }
    }
}
</script>

<style lang="less" scoped>
// 弹窗
.xuyu_modal{
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right:0px;
    background: rgba(0,0,0,0.1);
    z-index: 20;
    justify-content: center;
    align-items: center;
    display: flex;
    .content{
        width: 90%;
        // overflow: auto;
        z-index: 21;
        position: relative;
        // top: -10%;
        img{
            max-width: 100%;
        }
        .close_btn{
            position: absolute;
            bottom: -60px;
            width: 50px;
            height: 50px;
            left: 50%;
            margin-left: -25px;
            background: url('../assets/close.png') no-repeat center center;
            background-size: contain;
        }
    }
    .mask_box{
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right:0px;
        background: rgba(0,0,0,0.5);
    }
}
</style>
