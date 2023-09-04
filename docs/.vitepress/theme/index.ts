import DefaultTheme from 'vitepress/theme'
import BFrame from './BFrame.vue'
import MyLayout from './MyLayout.vue'
import NotFound from './NotFound.vue'
import Word from './Word.vue'
import WordList from './WordList.vue'
import JpWord from './JpWord.vue'
import JpWordList from './JpWordList.vue'
import { Card,Avatar } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueAudio from 'vue-audio';
// import 'ant-design-vue/es/card/style/css'
// import 'ant-design-vue/es/avatar/style/css'

import Member from './Member.vue'
// import Sound from './Sound.vue'
import './theme.css'
import './test'
export default {
  ...DefaultTheme,
  NotFound,
  Layout:MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('BFrame',BFrame)
    app.component('JpWord',JpWord)
    app.component('JpWordList',JpWordList)
    app.component('Word',Word)
    app.component('WordList',WordList)
    app.component('Member',Member)
    app.component('VueAudio',VueAudio)
    app.use(Card)
    app.use(Avatar)
    // app.component('Sound',Sound)
    // baidutongji
    // var _hmt = _hmt || [];
    // if(process.env.NODE_ENV === 'production' && typeof window !=='undefined'){
    //   var hm = document.createElement("script");
    //   hm.src = "https://hm.baidu.com/hm.js?ccf55dfd2764cf3ebf43d6b3c9da9b20";
    //   var s = document.getElementsByTagName("script")[0]; 
    //   s.parentNode.insertBefore(hm, s);
    // }

  //   DefaultTheme.enhanceApp(ctx)
  //   // ctx.app.component('VueClickAwayExample', VueClickAwayExample)
  }
}