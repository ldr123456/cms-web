import service from "@/utils/request";
/**
 * 获取课程列表
 * @param {*} params
 * @returns
 */
export const getCourseList = (params) => {
  return service({
    url: "/lesson/getLessonBaseList",
    method: "get",
    params,
  });
};
/**
 * 获取课程选修类型
 * @param {*} params
 * @returns
 */
export const getCompulsoryTypeList = () => {
  return service({
    url: "/lesson/getCompulsoryTypeList",
    method: "get",
  });
};
/**
 * 获取课程分类详细信息
 * @param {*} params
 * @returns
 */
export const getLessonTypeList = (params) => {
  return service({
    url: "/sysSortDictionary/findSysSortDictionary",
    method: "get",
    params
  });
};
/**
 * 删除课程
 * @param {*} params
 * @returns
 */
export const deleteLesson=(data)=>{
  return service({
    url:"/lesson/deleteLesson",
    method:"delete",
    data
  })
}
/**
 * 获取某个课程信息
 * @param {*} params
 * @returns
 */
export const getCourseDetail = (params) => {
  return service({
    url: "/lesson/getLessonByID",
    method: "get",
    params,
  });
};
/**
 * 查看课件列表
 */
 export const getCoursewareList = (data) => {
  return service({
    url: "/lessonWare/getLessonWareList",
    method: "post",
    data,
  });
};
/**  
 * 获取课件文件类型分类
 */
export const getCoursewareflietypeclassification = (params) => {
  return service({
    url: "/lessonWare/getLessonWareType",
    method: "get",
    params,
  });
};
/** 
 * 获取课件类目列表
 */
export const getCoursewarecategories = () => {
  return service({
    url: "/lessonWare/getLessonWareCate",
    method: "get",
  });
};
/** 
 *  创建课件
 */
export const createLessonWare = (data) => {
  return service({
    url: "/lessonWare/createLessonWare",
    method: "post",
    data
  });
};

/** 
 *  修改课件
 */

 export const modifyLessonWare = (data) => {
  return service({
    url: "/lessonWare/updateLessonWare",
    method: "put",
    data
  });
};


/** 
 *  删除课件
 */

export const deleteLessonWare = (data) => {
  return service ({
    url: "/lessonWare/deleLessonWare",
    method: "delete",
    data 
  });
};

/** 
 * 更新课程
 */
export const modifyLesson = (data) => {
  return service ({
    url: "/lesson/updateLesson",
    method: "put",
    data
  });
};

/** 
 * 创建课程
 */
export const createLesson = (data) => {
  return service ({
    url: "/lesson/createLesson",
    method: "post",
    data
  })
}
/** 
 * 获取用户列表
 */
export const getUserList=(data)=>{
  return service({
    url:"/user/getUserList",
    method:"post",
    data
  })
  
}
/** 
 * 创建课程：获取课件列表
 * 
 */
export const getLessonWareList=(data)=>{
  return service({
    url:"/lessonWare/getLessonWareList",
    method:"post",
    data
  })
}

/** 
 * 获取选中用户列表
 */
export const getSelectUserList=(data)=>{
  return service({
    url:"/user/getSelectUserList",
    method:"post",
    data
  })
}
/** 
 * 导入课件目录
 */
export const importWareList=(params)=>{
  return service({
      url:"/lessonWare/getLessonWareListByCateId",
      method:"get",
      params
  })
}