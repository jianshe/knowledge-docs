<script setup>
import { useSlots, computed, ref } from "vue";
const [word] = useSlots().default();
const isAudioPlayer = ref(false);
const props = defineProps({
  how: {
    type: Boolean,
    default: true,
  },
});
const showHow = computed(() => {
  return (
    props.how &&
    showPlay.value &&
    word.children.split(" ").filter((v) => v).length == 1
  );
});
const showPlay = computed(() => {
  return word && word.children;
});
function play1() {
  play(1);
}
function pron() {
  // https://howjsay.com/how-to-pronounce-frontend
  let url = "https://www.google.com/search?q=how+to+pronounce+" + word.children;
  console.log(url);
  window.open(url);
  // let ele = document.createElement('a')
}
function play(type) {
  const url = `https://dict.youdao.com/dictvoice?audio=${word.children}&type=${type}&le=ja`;
  const audio = new Audio(url);
  isAudioPlayer.value = true;
  audio.addEventListener("ended", function () {
    // 当音轨播放完毕时候做你想做的事情
    isAudioPlayer.value = false;
  });
  // audio.addEventListener
  audio.play();
}
</script>

<template>
  <div class="it-words" @click="pronunciation">
    <span>&nbsp;</span>
    <span>
      <slot></slot>
    </span>
    <div class="word-pron" v-if="showPlay">
      <a
        title="点击发音"
        href="javascript:;"
        class="pronounce tip"
        :class="{ audioClick: isAudioPlayer }"
        @click="play(1)"
        style="width: 20px; height: 20px; background-size: 20px 20px"
      ></a>
    </div>
    <span class="tip" v-if="showHow" @click="pron">How</span>
  </div>
</template>
<style scoped>
.it-words {
  cursor: pointer;
  color: var(--vp-c-brand);
  margin-right: 10px;
  display: inline-block;
}

.tip {
  color: var(--vp-badge-tip-text);
  display: inline-block;
  margin-left: 8px;
  border: 1px solid var(--vp-c-brand);
  border-radius: 10px;
  padding: 0 4px;
  line-height: 18px;
  font-size: 16px;
  font-weight: 600;
}
.word-pron {
  width: 21px;
  margin-right: 8px;
  font-size: 14px;
  display: inline-block;
  height: 20px;
}
.word-pron .pronounce {
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  display: flex;
  margin-top: 5px;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
  background: url(https://shared.ydstatic.com/market/souti/web_dict/online/2.7.3/dist/client/img/ic_result_voice_00.1048cc2.png)
    50% 50% no-repeat;
}

.word-pron .audioClick {
  animation: audioPlayingNew 1.5s infinite;
  -webkit-animation: audioPlayingNew 1.5s infinite;
}

@keyframes audioPlayingNew {
  0% {
    background-image: url(https://shared.ydstatic.com/market/souti/web_dict/online/2.7.3/dist/client/img/ic_result_voice_02.2f2075d.png);
  }
  30% {
    background-image: url(https://shared.ydstatic.com/market/souti/web_dict/online/2.7.3/dist/client/img/ic_result_voice_00.1048cc2.png);
  }
  60% {
    background-image: url(https://shared.ydstatic.com/market/souti/web_dict/online/2.7.3/dist/client/img/ic_result_voice_00.1048cc2.png);
  }
  100% {
    background-image: url(https://shared.ydstatic.com/market/souti/web_dict/online/2.7.3/dist/client/img/ic_result_voice_02.2f2075d.png);
  }
}
</style>
