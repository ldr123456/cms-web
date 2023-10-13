import service from '@/utils/request'

/**
 * 获取所有考试结果
 * @param {*} data
 * @returns
 */
export const reviewPaging = (data) => {
  return service({
    url: '/markExamPaper/reviewPaging',
    method: 'post',
    data: data
  });
};

/**
 * 获取一场考试的所有用户情况
 * @param {*} params
 * @returns
 */
export const getExamResultBaseListByID = (params) => {
  return service({
    url: '/markExamPaper/getEachStudentExamResultListByID',
    method: 'get',
    params
  });
};

/**
 * 获取用户的试卷
 * @param {*} params
 * @returns
 */
export const getEachExamResultDetail = (data) => {
  return service({
    url: '/markExamPaper/getEachExamResultDetail',
    method: 'post',
    data: data
  });
};

/**
 * 人工阅卷
 * @param {*} params
 * @returns
 */
export const markPaperByPerson = (data) => {
  return service({
    url: '/markExamPaper/markPaperByPerson',
    method: 'post',
    data: data
  });
};