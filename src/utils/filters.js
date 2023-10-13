/**
 * 转化时间格式
 * @param {*} date 2022-12-13T15:54:19.56+08:00
 * @returns 2022-12-13 07:54:19
 */
const dateFilter = (date) => {
  var json_date = new Date(date).toJSON();
  return new Date(new Date(json_date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
};

export default (app) => {
  app.config.globalProperties.$filters = {
    dateFilter
  };
};
