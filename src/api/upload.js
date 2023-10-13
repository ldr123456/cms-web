import service from "@/utils/request";
/**
 * 上传课程封面
 * @param {*} params
 * @returns
 */
export const uploadImage = (data) => {
  return service({
    url: "/fileUploadAndDownload/upload",
    method: "post",
    data,
  });
};
