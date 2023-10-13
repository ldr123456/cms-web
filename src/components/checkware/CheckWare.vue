<template>
  <el-dialog v-model="previewVisible" title="文件预览" width="60%">
    <div
      class="courseware"
      v-if="
        currentWare.lesson_ware_type_id === 1 ||
        currentWare.lesson_ware_type_id === 3
      "
    >
      <iframe
        id="iframe1"
        width="100%"
        height="100%"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
        :src="
          currentWare.lesson_ware_type_id === 1
            ? '/pdfjs/web/viewer.html?file=' +
              encodeURIComponent(
                currentWare.exa_file_upload_and_download_list[0].url
              )
            : 'https://view.officeapps.live.com/op/view.aspx?src=' +
              encodeURIComponent(
                currentWare.exa_file_upload_and_download_list[0].url
              )
        "
      ></iframe>
    </div>
    <div class="courseware" v-if="currentWare.lesson_ware_type_id === 4">
      <audio :src="audioUrl" controls></audio>
      <iframe
        id="iframe2"
        width="100%"
        height="90%"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
        :src="'/pdfjs/web/viewer.html?file=' + encodeURIComponent(pdfUrl)"
      ></iframe>
    </div>
    <div class="videoArea" v-if="currentWare.lesson_ware_type_id === 2">
      <VideoPlayer
        class="video-player vjs-big-play-centered"
        :src="videoUrl"
        crossorigin="anonymous"
        playsinline
        controls
        :volume="0.6"
        :height="320"
        :playback-rates="[0.7, 1.0, 1.5, 2.0]"
      ></VideoPlayer>
    </div>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
const pdfUrl = ref("");
const audioUrl = ref("");
const videoUrl = ref("");
//提取不同类型的url
const getUrl = (val) => {
  props.currentPreview.exa_file_upload_and_download_list &&
    props.currentPreview.exa_file_upload_and_download_list.forEach((item) => {
      if (val === "pdf" && item.tag === "pdf") {
        pdfUrl.value = item.url;
      } else {
        audioUrl.value = item.url.split("?")[0];
      }
    });
};
const props = defineProps(["currentPreview"]);
const previewVisible = ref(false);
const currentWare = ref({});
watch(
  () => props.currentPreview,
  () => {
    currentWare.value = { ...props.currentPreview };
    if (currentWare.value.lesson_ware_type_id === 2) {
      videoUrl.value =
        currentWare.value.exa_file_upload_and_download_list[0].url.split(
          "?"
        )[0];
    } else {
      getUrl("pdf");
    }
  }
);
const openDialog = () => {
  previewVisible.value = true;
};
const closeDialog = () => {
  previewVisible.value = false;
};
// 暴露变量
defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style lang="scss" scoped>
.courseware {
  height: 70vh;
}
.video-js {
  width: 100%;
  height: 600px;
}
</style>
