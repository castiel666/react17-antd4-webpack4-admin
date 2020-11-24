//这个function是在服务器不支持权限配置的时候，为了前端结构不做大的修改，用于作为默认权限。
let functions = [
    {
        title: '查看',
        name: 'Query',
        permit: true,
        key: 'TestQuery',
        url: null,
    },
    {
        title: '新增',
        name: 'New',
        permit: true,
        key: 'TestNew',
        url: null,
    },
    {
        title: '编辑',
        key: 'TestEdit',
        permit: true,
        name: 'Edit',
        url: null,
    },
    {
        title: '删除',
        name: 'Delete',
        permit: true,
        key: 'TestDelete',
        url: null,
    }
];

//服务端有权限配置，填{}，代码执行时会被替换。否则把上面的functions填入作为默认权限
//同时leftMenu/Index.js里  componentDidMount中menuData数据不再需要checkPower

//左侧导航栏配置
module.exports = [
    {
        functions: {},
        icon: require('../../images/tabImg/icon_nav.png'),
        icon_active: require('../../images/tabImg/icon_nav_active.png'),
        id: 'AccountManage',
        index: 25,
        name: '后台账号',
        parentId: null,
        type: 1,
        url: null,
    },
    {
        functions: {},
        icon: null,
        id: 'AccountList',
        index: 1,
        name: '账号列表',
        parentId: 'AccountManage',
        type: 2,
        url: 'AccountList',
    },
];
