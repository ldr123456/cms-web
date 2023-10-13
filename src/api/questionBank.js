// 题库管理接口文件
import service from '@/utils/request'
/**
 * 获取所有题库信息
 * @param {*} params
 * @returns
 */
export const getAllExamQuestionBank = (params) => {
  return service({
    url: '/questionBank/getAllExamQuestionBank',
    method: 'get',
    params
  });
};

/**
 * 分页获取所有题库信息
 * @param {*} params
 * @returns
 */
export const getExamQuestionBankList = (params) => {
  return service({
    url: '/questionBank/getExamQuestionBankList',
    method: 'get',
    params
  });
};

/**
 * 通过id获取单个题库信息
 * @param {*} params
 * @returns
 */
export const getQuestionBankById = (params) => {
  return service({
    url: '/questionBank/getQuestionBankById',
    method: 'get',
    params
  });
};

/**
 * 添加题库
 * @param {*} data
 * @returns
 */
export const createQuestionBank = (data) => {
  return service({
    url: '/questionBank/createQuestionBank',
    method: 'post',
    data: data
  });
};

/**
 * 批量删除题库
 * @param {*} data
 * @returns
 */
export const batchDeleteQuestionBank = (data) => {
  return service({
    url: '/questionBank/batchDeleteQuestionBank',
    method: 'delete',
    data: data
  });
};

/**
 * 更新题库
 * @param {*} data
 * @returns
 */
export const updateQuestionBank = (data) => {
  return service({
    url: '/questionBank/updateQuestionBank',
    method: 'put',
    data: data
  });
};