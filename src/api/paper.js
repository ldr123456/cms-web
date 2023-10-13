import service from '@/utils/request'

/**
 * 获取试卷管理分页信息
 * @param {*} params
 * @returns
 */
export const findExamPaperList = (params) => {
  return service({
    url: '/examPaper/findExamPaperList',
    method: 'get',
    params
  });
};

/**
 * 获取单个试卷信息
 * @param {*} params
 * @returns
 */
export const getExamPaperByID = (params) => {
  return service({
    url: '/examPaper/getExamPaperByID',
    method: 'get',
    params
  });
};

/**
 * 删除单个试卷
 * @param {*} params
 * @returns
 */
export const deleteExamPaper = (data) => {
  return service({
    url: '/examPaper/deleteExamPaper',
    method: 'delete',
    data: data
  });
};

/**
 * 添加试卷
 * @param {*} params
 * @returns
 */
export const createExamPaper = (data) => {
  return service({
    url: '/examPaper/createExamPaper',
    method: 'post',
    data: data
  });
};

/**
 * 更新试卷
 * @param {*} params
 * @returns
 */
export const updateExamPaper = (data) => {
  return service({
    url: '/examPaper/updateExamPaper',
    method: 'put',
    data: data
  });
};

