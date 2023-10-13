import service from '@/utils/request'

// 实现简单的发送请求，来测试请求成功
export const getPa = () => {
    return service({
        method: "GET",
        url: "/examNotice/getNoticeDetail"
    })
}

// 获取公告的详情
export const getPaDetail = () => {
    return service({
        method: "POST",
        url: "/examNotice/getPagingNotice",
        data: {
            "page": 1,
            "pageSize": 10
        }
    })
}

// 实现添加公告的请求
export const addPa = (title, content) => {
    return service({
        method: "POST",
        url: "/examNotice/increaseNotice",
        data: {
            title,
            content
        }
    })
}

// 实现更新公告的请求
export const updatePa = (notice_id, title, content) => {
    return service({
        method: "POST",
        url: "/examNotice/updateNotice",
        data: {
            notice_id,
            title,
            content
        }
    })
}

export const delPa = (notice_id) => {
    return service({
        method: "POST",
        url: "/examNotice/deleteNotice",
        data: {
            notice_id
        }
    })
}