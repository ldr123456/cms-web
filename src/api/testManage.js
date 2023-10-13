// 试题管理接口
import service from '@/utils/request'
/**
 * 分页获取试题列表信息
 * @param {*} params
 * @returns
 */
export const getExamQuestionList = (params) => {
  return service({
    url: '/question/getExamQuestionList',
    method: 'get',
    params
  });
};

/**
 * 创建试题
 * @param {*} data
 * @returns
 */
export const createQuestion = (data) => {
  return service({
    url: '/question/createQuestion',
    method: 'post',
    data: data
  });
};

/**
 * 更新试题
 * @param {*} data
 * @returns
 */
export const updateQuestion = (data) => {
  return service({
    url: '/question/updateQuestion',
    method: 'put',
    data: data
  });
};

/**
 * 删除单个试题信息
 * @param {*} data
 * @returns
 */
export const deleteQuestion = (data) => {
  return service({
    url: '/question/deleteQuestion',
    method: 'delete',
    data: data
  });
};

/**
 * 批量删除试题信息
 * @param {*} data
 * @returns
 */
export const batchDeleteQuestion = (data) => {
  return service({
    url: '/question/batchDeleteQuestion',
    method: 'delete',
    data: data
  });
};

/**
 * 通过id获取试题详细信息
 * @param {*} params
 * @returns
 */
export const findExamQuestion = (params) => {
  return service({
    url: '/question/findExamQuestion',
    method: 'get',
    params
  });
};

/**
 * 分页获取训练统计数据
 * @param {*} params
 * @returns
 */
export const getExamTrainStatisticsList = (params) => {
  return service({
    url: '/trainStatistics/getExamTrainStatisticsList',
    method: 'get',
    params
  });
};
