<template lang="html">
    <!-- 底部菜单 -->
    <ul class="footer">
        <li class="menu" @click="changeMenu">
            <img src="../assets/icon_nav.png" alt="" v-show="showNav">
            <img src="../assets/icon_so.png" alt="" v-show="!showNav">
        </li>
        <li v-if="!showNav" style="flex: 1;" @click.stop.prevent="inputPaentClick('input1')">
            <input type="search" ref="input1" v-model="keyword" placeholder="输入关键词搜索作品..." class="input_box" @keyup.enter="search"/>
        </li>
        <li v-if="!showNav">
            <a @click="soso()" class="soso_btn">搜索</a>
        </li>
        <template v-if="showNav">
            <li  class="other" v-bind:class="{'active': v.active}" :key="v.code" v-for="v in nav" @click="changeType(v)">{{v.name}}</li>
        </template>
    </ul>
</template>

<script>

export default {
    data(){
        return {
            keyword: '',
            showNav: true,
            //菜单
            nav: [{
                name: '高年级组',
                code: 'hight',
                path: null,
                active: false
            },{
                name: '低年级组',
                code: 'low',
                path: null,
                active: false
            },{
                name: '助力美育',
                code: 'zhuli',
                path: 'https://ssl.gongyi.qq.com/m/weixin/detail.htm?et=thxqr&pid=1000024329&parent1=68541EAF0D61B9A9F9D3DC8A1AE0CDDE6F90A935666218A5C35DCCDBCA312CFBE35062FC3FC854ABB0451968C1A8D0F8',
                active: false
            }]
        }
    },
    watch: {
        '$route': {
            immediate: true,
            handler(val){
                this.nav = this.nav.filter(v => v.name != 'zhuli').map( v => {
                    v.active = false;
                    if(v.code == val.name) v.active = true;
                    return v;
                })
            }
        }
    },
    methods: {
        inputPaentClick(refName){
            this.$nextTick(() => {
                this.$refs[refName] && this.$refs[refName].focus();
            })
        },
        soso(){
            let _keyword = this.keyword.trim();
            if(!_keyword){
                return this.$Message.warning('请输入关键词！');
            }
            this.$emit('searchImage', _keyword);
        },
        search(e){
            if(e.keyCode == '13'){
                let _keyword = this.keyword.trim();
                if(!_keyword){
                    return this.$Message.warning('请输入关键词！');
                }
                this.$emit('searchImage', _keyword);
            }
        },
        // 切换菜单
        changeMenu(){
            this.showNav = !this.showNav;
        },
        //切换场馆
        changeType(val){
            if(val.active) return false;
            if(val.code === 'zhuli'){
                let _path = this.nav.find( v => v.code === val.code)['path'];
                window.open(_path, '_blank');
            }
            else{
                this.$router.push({
                    path: val.code
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.footer{
    height: 50px;
    background-color: #f9f9f9;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    li{
        line-height: 50px;
        justify-content: center;
        align-items: center;
        display: flex;
    }
    .menu{
        width: 40px;
        display: flex;
        img{
            width: 32px;
            height: 32px;
        }
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
    .soso_btn{
        display: block;
        color: #fff;
        font-size: 14px;
        background: #6B3632;
        border-radius: 25px;
        padding: 0px 12px;
        height: 36px;
        line-height: 36px;
        margin: auto 10px;
    }
    .other{
        flex: 1;
        line-height: 50px;
        border-left: 1px solid #ddd;
        &.active{
            color: #5E1914;
            font-weight: bold;
        }
        a{
            color: #2c3e50;
        }
    }
}
</style>
