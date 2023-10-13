<template>
  <editor v-model="content" tag-name="div" :init="init" />
</template>

<script lang="ts">
import { uploadImage } from "../../api/upload";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme"; // 引用主题文件
import "tinymce/icons/default"; // 引用图标文件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //查看源码
import "tinymce/plugins/codesample"; //插入代码1
import "tinymce/plugins/directionality"; //
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/image"; //图片
import "tinymce/plugins/importcss"; //图片工具
import "tinymce/plugins/media"; //媒体插入
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/quickbars"; //快捷菜单
import "tinymce/plugins/searchreplace"; //查询替换
import "tinymce/plugins/tabfocus"; //
import "tinymce/plugins/textpattern"; //
import { onMounted, ref, watch } from "vue";

export default {
  props: ["modelValue"],
  components: {
    editor: Editor,
  },
  emits: { "update:modelValue": null },
  setup(props: any, context: any) {
    const init = {
      language_url: "/tinymce/langs/zh_CN.js", // 中文语言包路径
      language: "zh_CN",
      skin_url: "/tinymce/skins/ui/oxide", // skin路径
      content_css: "/tinymce/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
      menubar: false, // 隐藏菜单栏
      autoresize_bottom_margin: 50,
      max_height: 500,
      min_height: 350,
      //   height: 320,
      media_live_embeds: true,
      toolbar_mode: "none",
      plugins:
        "textpattern  tabfocus  searchreplace  quickbars preview  media  importcss  image  fullscreen  directionality codesample code charmap link code table  autoresize autosave link", // 插件需要import进来
      toolbar:
        "formats undo redo  fontsizeselect fontselect   searchreplace preview pagebreak media image|outdent indent aligncenter alignleft alignright alignjustify lineheight  underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough  charmap link codesample code fullscreen",
      content_style: "p {margin: 5px 0; font-size: 14px}",
      fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
      font_formats:
        "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
      branding: false,
      elementpath: false,
      resize: false, // 禁止改变大小
      statusbar: false, // 隐藏底部状态栏
      // paste_data_images: true, // 允许粘贴图像

      file_picker_types: "file image media",
      //文件上传
      file_picker_callback: function (callback: any, value: any, meta: any) {
        //文件分类
        var filetype =
          ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4";
        //为不同插件指定文件类型
        switch (meta.filetype) {
          case "image":
            filetype = ".jpg, .jpeg, .png, .gif";
            break;
          case "media":
            filetype = ".mp3, .mp4";
            break;
          case "file":
          default:
        }
        //模拟出一个input用于添加本地文件
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", filetype);
        input.click();
        input.onchange = function (v: any) {
          var file = v.target.files[0];
          var formData = new FormData();
          formData.append("file", file, file.name);
          uploadImage(formData).then((res) => {
            callback(res.file.url, { title: file.name });
          });
        };
      },
      //   图片上传
      images_upload_handler: async (blobInfo: any, success: any) => {
        var form = new FormData();
        form.append("file", blobInfo.blob(), blobInfo.filename());
        uploadImage(form).then((res: any) => {
          console.log(res);
          success(res.data.file.url);
        });
        // var reader = new FileReader();
        // reader.readAsDataURL(blobInfo.blob());
        // reader.onload = function () {

        //   success(this.result);
        // };
      },
    };
    const content = ref();
    watch(
      () => content.value,
      () => {
        revert_data(content.value);
      }
    );
    watch(
      () => props.modelValue,
      () => {
        content.value = props.modelValue;
      }
    );

    tinymce.init; // 初始化

    const revert_data = (content: any) => {
      context.emit("update:modelValue", content);
    };
    return {
      init,
      revert_data,
      content,
    };
  },
};
</script>
