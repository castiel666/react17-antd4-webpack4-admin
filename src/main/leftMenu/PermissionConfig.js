//keyArray里定义所有会用到的权限类型，treeData里的name值必须从这里选，否则匹配不到
module.exports = {
    keyArray:[
        {
            key: "Query",
            desc: "查询权限，比如查询列表，查询详情",
        },
        {
            key: "New",
            desc: "新增权限，比如列表右上角的新增按钮",
        },
        {
            key: "Edit",
            desc: "编辑权限，比如列表操作栏的编辑，禁用等",
        },
        {
            key: "Delete",
            desc: "删除权限，比如列表操作栏的删除",
        },
        {
            key: "Developer",
            desc: "开发者权限，（属于自定义）",
        },
        {
            key: "Special",
            desc: "特殊权限，（属于自定义）",
        },
    ],
    treeData:[
        {
            title: '通用权限',
            key: 'Others',
            hide: true, //这个权限不需要选择，设置为隐藏(比如查询个人信息，修改密码等)
            children: [
                {
                    title: '查询',
                    name: 'Query',
                    permit: true,
                    key: 'OthersQuery',
                    url: '/admin/admin/getAdminDetail,/admin/admin/modfiyPasswd,/admin/admin/logoutAdmin'
                },
                {
                    title: '编辑',
                    name: 'Edit',
                    permit: true,
                    key: 'OthersEdit',
                    url: '/admin/upload/getUploadToken,/common/upload'
                },
            ]
        },
        {
            title: '后台账号管理',
            key: 'AccountManage',
            children: [
                {
                    title: '查看',
                    name: 'Query',
                    permit: true,
                    key: 'AccountManageQuery',
                    url: '/admin/admin/getAdminList'
                },
                {
                    title: '创建后台管理账号',
                    name: 'New',
                    permit: true,
                    key: 'AccountManageNew',
                    url: '/admin/admin/addAdmin'
                },
                {
                    title: '编辑后台账号',
                    key: 'AccountManageEdit',
                    permit: true,
                    name: 'Edit',
                    url: '/admin/admin/editAdmin,/admin/admin/getAdminDetail,/admin/admin/enableAdmin,'
                },
                {
                    title: '删除后台账号',
                    name: 'Delete',
                    permit: true,
                    key: 'AccountManageDelete',
                    url: '/admin/admin/delAdmin'
                }
            ]
        },
    ]
};
