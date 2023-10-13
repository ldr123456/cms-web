import service from "@/utils/request";

/**
 * 分页获取数据字典列表
 * @param {*} params
 * @returns
 */
export const getSysDataDictionaryList = (params) => {
  return service({
    url: "/sysDataDictionary/getSysDataDictionaryList",
    method: "get",
    params,
  });
};

/**
 * 添加数据字典
 * @param {*} data
 * @returns
 */
export const createSysDataDictionary = (data) => {
  return service({
    url: "/sysDataDictionary/createSysDataDictionary",
    method: "post",
    data,
  });
};

/**
 * 更新数据字典
 * @param {*} data
 * @returns
 */
export const updateSysDataDictionary = (data) => {
  return service({
    url: "/sysDataDictionary/updateSysDataDictionary",
    method: "put",
    data,
  });
};

/**
 * 删除数据字典
 * @param {*} data
 * @returns
 */
export const deleteSysDataDictionary = (data) => {
  return service({
    url: "/sysDataDictionary/deleteSysDataDictionary",
    method: "delete",
    data,
  });
};

// 数据字典项详情

/**
 * 通过id获取数据字典的字典项数据
 * @param {*} params
 * @returns
 */
export const findSysDataDictionaryDetail = (params) => {
  return service({
    url: "/sysDataDictionaryDetail/findSysDataDictionaryDetail",
    method: "get",
    params,
  });
};

/**
 * 添加数据字典的字典项
 * @param {*} data
 * @returns
 */
export const createSysDataDictionaryDetail = (data) => {
  return service({
    url: "/sysDataDictionaryDetail/createSysDataDictionaryDetail",
    method: "post",
    data,
  });
};

/**
 * 更新数据字典的字典项
 * @param {*} data
 * @returns
 */
export const updateSysDataDictionaryDetail = (data) => {
  return service({
    url: "/sysDataDictionaryDetail/updateSysDataDictionaryDetail",
    method: "put",
    data,
  });
};

/**
 * 删除数据字典的字典项
 * @param {*} data
 * @returns
 */
export const deleteSysDataDictionaryDetail = (data) => {
  return service({
    url: "/sysDataDictionaryDetail/deleteSysDataDictionaryDetail",
    method: "delete",
    data,
  });
};
