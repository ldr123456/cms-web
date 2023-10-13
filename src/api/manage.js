/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-05-11 08:04:17
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-05-13 09:32:17
 * @FilePath: \cms-web\src\api\manage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 管理首页接口
import service from '@/utils/request'

/**
 * 获取统计总览信息
 * @param {*} 
 * @returns
 */
export const getManageStatisticsAll = () => {
  return service({
    url: '/manage/getManageStatisticsAll',
    method: 'get'
  });
};

/**
 * 获取进行中的考试
 * @param {*} 
 * @returns
 */
export const getDashExamList = () => {
  return service({
    url: '/manage/getDashExamList',
    method: 'get'
  });
};

/**
 * 获取进行中的课程
 * @param {*} 
 * @returns
 */
export const getDashCourseList = () => {
  return service({
    url: '/manage/getDashCourseList',
    method: 'get'
  });
};

/**
 * 获取公告列表
 * @param {*} data
 * @returns 
 */
export const getPagingNotice = (data) => {
  return service({
    url: '/examNotice/getPagingNotice',
    method: 'post',
    data
  });
};