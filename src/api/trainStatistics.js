// 训练统计接口
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