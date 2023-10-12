import DefaultTheme from 'vitepress/theme'
import BFrame from './BFrame.vue'
import MyLayout from './MyLayout.vue'
import NotFound from './NotFound.vue'
import Word from './Word.vue'
import WordList from './WordList.vue'
import JpWord from './JpWord.vue'
import JpWordList from './JpWordList.vue'
import { Card, Avatar } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import 'ant-design-vue/es/card/style/css'
// import 'ant-design-vue/es/avatar/style/css'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import VueViewer from './utils/v-viewer-ssr'
import 'viewerjs/dist/viewer.css'

import ZoomImg from './ZoomImg.vue'
import ViewerZoom from  './ViewerZoom.vue'
// import Sound from './Sound.vue'
import './theme.css'
import './test'
let first = true;
export default {
  ...DefaultTheme,
  NotFound,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('BFrame', BFrame)
    app.component('JpWord', JpWord)
    app.component('JpWordList', JpWordList)
    app.component('Word', Word)
    app.component('WordList', WordList)
    app.component('ZoomImg', ZoomImg)
    app.component('ViewerZoom',ViewerZoom)
    app.use(Card)
    app.use(Avatar)
    app.use(VueViewer)

    // app.use(VuePlyr, {
    //   plyr: {}
    // })
    app.mixin({
      async mounted() {
        //你自己的插件地址
        if (!first) return;
        first = false;
        import('vue-plyr').then(module => {
            app.use(module.default);
        })
      },
    });
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