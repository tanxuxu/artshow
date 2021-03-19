import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //高年级
    artImage: [],
    //低年级
    otherImage: [],
    //首次进入
    isFirst: true,
    //高年级
    hightPlay: false,
    //低年级
    lowPlay: false,
    //主音频
    mainPlay: false,
    //显示控制
    mainControl: true,
    hightControl: false,
    lowControl: false
  },
  mutations: {
      setState(state, data){
         state[data.name] = data.value;
     }
  }
})
