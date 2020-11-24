let APILXD = {
    /**
     * 通用
     */
    //上传文件
    upLoad: '/common/upload',
    //获取上传文件的token(阿里，七牛)
    getUploadToken: '/admin/upload/getUploadToken',


    /**
     * 后台账号管理
     */
    //登陆
    login: '/admin/admin/login',
    //获取密码随机串
    getRandSalt: '/admin/admin/getRandSalt',
    //后台账号列表
    getAdminList: '/admin/admin/getAdminList',
    //新增账号
    addAdmin: '/admin/admin/addAdmin',
    //查询账号详情
    getAdminDetail: '/admin/admin/getAdminDetail',
    //编辑账号
    editAdmin: '/admin/admin/editAdmin',
    //删除账号
    delAdmin: '/admin/admin/delAdmin',
    //退出登陆
    logoutAdmin: '/admin/admin/logoutAdmin',
    //修改密码
    modfiyPasswd: '/admin/admin/modfiyPasswd',
    //启用、禁用管理员
    enableAdmin: '/admin/admin/enableAdmin',
};

module.exports = APILXD;
