<template lang="html">
    <!-- 弹出框 -->
    <div class="modal_box" v-if="showModal">
        <span  class="close_btn" @click="closeModal()">
            <Icon type="ios-close-circle" size="50" color="#000" />
        </span>
        <div class="content">
            <input type="search" placeholder="输入关键词搜索作品..." v-model="keyword" class="input_box" @keyup.enter="keyupSearch"/>
            <ul>
                <li v-for="(v, index) in data" :key="index" @click="gotoImage(v.id)">
                    <img :src="v.img" alt="">
                    <p>《{{v.title}}》</p>
                    <p>作者：{{v.stu}}</p>
                </li>
            </ul>
            <p style="text-align: center; line-height: 50px;" v-show="!data.length">暂无数据</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data(){
        return {
            showModal: false,
            keyword: "",

        }
    },
    methods: {
        //关闭窗口
        closeModal(){
            this.showModal = false;
        },
        openModal(keyword = ''){
            this.keyword = keyword;
            this.showModal = true;
        },
        //关键词搜索
        keyupSearch(e){
            if(e.keyCode == '13'){
                let _keyword = this.keyword.trim();
                if(!_keyword){
                    return this.$Message.warning('请输入关键词！');
                }
                this.$emit('searchImage', _keyword);
            }
        },
        //筛选到某张图片
        gotoImage(id){
            this.$emit('gotoImage', id);
            this.showModal = false;
        },
    }
}
</script>

<style lang="less" scoped>
// 弹出
.modal_box{
    width: 90vw;
    height: 80vh;
    background: #fff;
    border-radius: 25px;
    z-index: 20;
    position: absolute;
    left: 5vw;
    top: 10vh;
    padding: 20px 0px;
    box-shadow: 0px 0px 0px 200px rgba(0,0,0,0.5);
    .content{
        overflow: auto;
        height: 100%;
        padding:0px 20px;
    }
    .close_btn{
        position: absolute;
        right: -10px;
        top: -10px;
        z-index: 21;
        background: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .input_box{
        height: 38px;
        line-height: 38px;
        width: 100%;
        outline: none;
        padding: 3px 15px;
        border: 1px solid #ddd;
        border-radius: 25px;
        display: block;
        -webkit-appearance: none;
        font-size: 14px;
    }
    ul{
        overflow: hidden;
        li{
            width: 50%;
            float: left;
            padding: 5px;
            font-size: 12px;
            p{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            img{
                width: 100%;
                border: 1px solid #ddd;
                margin-bottom: 10px;
                height: 100px;
            }
        }
    }
}
</style>
