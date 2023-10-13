// 考试管理接口文件
import service from '@/utils/request'

/**
 * 获取考试管理分页
 * @param {*} params
 * @returns
 */
export const getPagingExam = (params) => {
  return service({
    url: '/exam/getPagingExam',
    method: 'get',
    params
  });
};

/**
 * 删除选中项考试管理
 * @param {*} data
 * @returns
 */
export const deleteExam = (data) => {
  return service({
    url: '/exam/deleteExam',
    method: 'delete',
    data: data
  });
};

/**
 * 获取选中项考试信息
 * @param {*} params
 * @returns
 */
export const getExamAndPaper = (params) => {
  return service({
    url: '/exam/getExamAndPaper',
    method: 'get',
    params
  });
};

/**
 * 获取指定人员表格信息
 * @param {*} params
 * @returns
 */
export const getPagingExamManagementUser = (params) => {
  return service({
    url: '/examManagement/getPagingExamManagementUser',
    method: 'get',
    params
  });
};

/**
 * 添加指定人员信息
 * @param {*} data
 * @returns
 */
export const CreateExamManagementUser = (data) => {
  return service({
    url: '/examManagement/CreateExamManagementUser',
    method: 'post',
    data: data
  });
};

/**
 * 删除指定人员
 * @param {*} data
 * @returns
 */
export const deleteExamManagementUser = (data) => {
  return service({
    url: '/examManagement/deleteExamManagementUser',
    method: 'delete',
    data: data
  });
};

/**
 * 更新考试信息
 * @param {*} data
 * @returns
 */
export const updateExam = (data) => {
  return service({
    url: '/exam/updateExam',
    method: 'put',
    data: data
  });
};

/**
 * 创建考试
 * @param {*} data
 * @returns
 */
export const createExam = (data) => {
  return service({
    url: '/exam/createExam',
    method: 'post',
    data: data
  });
};
