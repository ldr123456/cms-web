import service from '@/utils/request'

/**
 * 获取部门权限
 * @param {*} params
 * @returns
 */
export const getDepartmentList = (params) => {
  return service({
    url: '/department/getDepartmentList',
    method: 'get',
    params
  })
}