import service from "@/utils/request";

/**
 * 分页获取分类字典列表
 * @param {*} params
 * @returns
 */
export const getSysSortDictionaryList = (params) => {
  return service({
    url: "/sysSortDictionary/getSysSortDictionaryList",
    method: "get",
    params,
  });
};

/**
 * 添加分类字典
 * @param {*} data
 * @returns
 */
export const createSysSortDictionary = (data) => {
  return service({
    url: "/sysSortDictionary/createSysSortDictionary",
    method: "post",
    data,
  });
};

/**
 * 更新分类字典
 * @param {*} data
 * @returns
 */
export const updateSysDictionary = (data) => {
  return service({
    url: "/sysDictionary/updateSysDictionary",
    method: "put",
    data,
  });
};

/**
 * 删除分类字典
 * @param {*} data
 * @returns
 */
export const deleteSysSortDictionary = (data) => {
  return service({
    url: "/sysSortDictionary/deleteSysSortDictionary",
    method: "delete",
    data,
  });
};

// 分类字典项详情

/**
 * 通过id获取数据字典的字典项数据
 * @param {*} params
 * @returns
 */
export const findSysSortDictionary = (params) => {
  return service({
    url: "/sysSortDictionary/findSysSortDictionary",
    method: "get",
    params,
  });
};

/**
 * 添加分类字典的字典项
 * @param {*} data
 * @returns
 */
export const createSysSortDictionaryDetail = (data) => {
  return service({
    url: "/sysSortDictionaryDetail/createSysSortDictionaryDetail",
    method: "post",
    data,
  });
};

/**
 * 更新分类字典的字典项
 * @param {*} data
 * @returns
 */
export const updateSysSortDictionaryDetail = (data) => {
  return service({
    url: "/sysSortDictionaryDetail/updateSysSortDictionaryDetail",
    method: "put",
    data,
  });
};

/**
 * 删除分类字典的字典项
 * @param {*} data
 * @returns
 */
export const deleteSysSortDictionaryDetail = (data) => {
  return service({
    url: "/sysSortDictionaryDetail/deleteSysSortDictionaryDetail",
    method: "delete",
    data,
  });
};
