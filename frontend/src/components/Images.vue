<template lang="pug">
#app
  a#header(target="_blank",title="powered by FunTV system team") Funtv Gallery
  #content
    //- vue-waterfall-easy(ref="waterfall",:imgsArr="imgsArr",@scrollReachBottom="getData", @click="clickFn", :enablePullDownEvent="true", @pullDownMove="pullDownMove",@pullDownEnd="pullDownEnd")
    vue-waterfall-easy(ref="waterfall",:imgsArr="imgsArr",@scrollReachBottom="getData", @click="clickFn", @imgError="imgErrorFn")
      .img-info(slot-scope="props")
        p.some-info {{props.value.info}}

      //-div(slot="waterfall-head")
        h1 waterfall-head
        h1 waterfall-head
    //- 自定义加载动画
    //-div(slot="loading" slot-scope="{isFirstLoad}")
      div(slot="loading" v-if="isFirstLoad") first-loading...
      div(v-else) loading...
</template>

<script>
import vueWaterfallEasy from './vue-waterfall-easy.vue'
import axios from 'axios'
export default {
  name: 'images',
  data() {
    return {
      imgsArr: [],
      group: 0, // 当前加载的加载图片的次数
      pullDownDistance: 0
    }
  },
  components: {
    vueWaterfallEasy
  },
  methods: {
    getData() {
      axios.get('http://127.0.0.1:8000/api/imgs' + this.group) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个静态json文件模拟
        .then(res => {
          this.group++
          if (this.group === 10) { // 模拟已经无新数据，显示 slot="waterfall-over"
            this.$refs.waterfall.waterfallOver()
            return
          }
          this.imgsArr = this.imgsArr.concat(res.data)
        })
    },
    clickFn(event, { index, value }) {
      // event.preventDefault()
      if (event.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked', index, value)
      }
    },
    imgErrorFn(imgItem){
      console.log('图片加载错误',imgItem)
    },
    changeImgArr() {
      axios.get('http://127.0.0.1:8000/api/imgs') // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个静态json文件模拟
        .then(res => {
          this.imgsArr = res.data
        })
    },
    pullDownMove(pullDownDistance) {
      // console.log('pullDownDistance', pullDownDistance)
      this.pullDownDistance = pullDownDistance
    },
    pullDownEnd(pullDownDistance) {
      console.log('pullDownEnd')
      if(this.pullDownDistance>50){
        alert('下拉刷新')
      }
      this.pullDownDistance = 0
    },
  },
  created() {
    this.getData()
    // 删除某个卡片
    // setTimeout(()=>{
    //   this.imgsArr.splice(1,1)
    // },2000)
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
a {
  color: #000;
  text-decoration: none;
  &:active {
    color: #000;
  }
}
html,
body,
#app {
  height: 100%;
}
#app {
  position: relative;
  #header {
    display: block;
    text-align: center;
    background: #000;
    color: #cccccc;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
    position: fixed;
    z-index: 999;
    width: 100%;
  }
  #content {
    position: absolute;
    top: 32px;
    bottom: 0;
    width: 100%;
  }
}
// .__err__ .img-wraper {
//   background: url(/static/img/1.jpg) no-repeat center/100px 100px !important;
// }
#app {
  overflow: auto;
  position: relative;
  .some-info {
    line-height: 1.6;
    text-align: center;
  }
}
</style>


<!--<template>-->
<!--  <div id="app">-->
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import HelloWorld from './components/HelloWorld.vue'-->

<!--export default {-->
<!--  name: 'App',-->
<!--  components: {-->
<!--    HelloWorld-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--#app {-->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--  text-align: center;-->
<!--  color: #2c3e50;-->
<!--  margin-top: 60px;-->
<!--}-->
<!--</style>-->
