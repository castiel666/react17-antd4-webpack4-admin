import React, {Component} from 'react';
import {Table, Button, message, Spin} from 'antd';
import LXDHelp from "../help/LXDHelp";
import SearchBox from '../../components/searchBox/SearchBox.js';
import less from './ListPage.less';
import HttpTool from '../../tool/HttpTool';

class ListPage extends Component {

    constructor(props) {
        super(props);
        //配置状态机
        this.state = {
            loading: false,
            pageSize: 10,    //分页，每页条数
            page: 1,         //分页，当前页
            total: 0,        //分页，数据总数
            tableKey: 0,
            sortMsg: {
                type: null,
                field: null,
            },
            selectedRowKeys: [],
        };

        log(this.props);
        log("==");

        //初始列表数据
        this.items = null;

        //记录每次查询过的参数集
        this.searchParam = {};

        //权限
        this.powerConfig = this._initPower();
        log('++++++++++++++++此页面的权限如下++++++++++++++++');
        log(this.powerConfig);

        //列表配置
        this.listConfig = this.base_getListConfig();
        log("====================列表配置==================");
        log(this.listConfig);

        //默认参数，每次重置以后赋值为这个数据
        this.defaultSearchParam = this.listConfig.search && this.listConfig.search.defaultSearchParam || {};
        //记录每次查询过的参数集
        this.searchParam = this.defaultSearchParam;

    }

    _initPower() {
        log(this.props.post.functions);
        if (this.props.post.navPath) {
            return window.___.getPower(this.props.post.navPath);
        } else {
            return window.___.initPower(this.props.post.functions);
        }
    }

    componentDidMount() {
        //请求数据
        this._loadDataForNet();
    }

    //
    _getColumns() {
        let columns = _.merge([], this.listConfig.table.columns) || [];
        let sortMsg = this.state.sortMsg;
        for (let obj of columns) {
            if (obj.sort) {
                obj.sorter = true;
                obj.sortOrder = (sortMsg.field === obj.dataIndex) ? sortMsg.type : false;
            }
        }
        return columns;
    }

    //用于设置输入框的内容和formbox里的各项值
    _setSearchValue(keyword, parameterArr) {
        if (this.searchBox) {
            this.searchBox.setSearchValue(keyword, parameterArr)
        }
    }

    //搜索条
    _getSearchBox() {
        let {
            Query
        } = this.powerConfig;
        if (Query) {
            if (!this.listConfig.search) {
                // console.error("please add search in listConfig")
                return null;
            }
            if (!this.listConfig.search.option) {
                // console.error("please add option in listConfig.search")
                return null;
            }
        }
        return Query ? (
            <SearchBox
                ref={ref => this.searchBox = ref}
                {...this.listConfig.search.option}
                searchAction={(value, changeState) => {
                    changeState('searchLoading', true);
                    this.searchParam = value;
                    this._loadDataForNet(1, undefined, () => {
                        changeState('searchLoading', false);
                    });
                }}
                reSetAction={(changeState) => {
                    changeState('resetLoading', true);
                    this.searchParam = this.listConfig.search.allReset ? {} : this.defaultSearchParam;
                    this.setState({
                        sortMsg: {
                            type: null,
                            field: null,
                        }
                    }, () => {
                        this._loadDataForNet(1, undefined, () => {
                            changeState('resetLoading', false);
                        });
                    })
                }}
                seniorSearch={this.listConfig.search.seniorSearch}
            />
        ) : null
    }


    //额外的内容框
    _getExtraBox() {
        return this.listConfig.extraBox && this.listConfig.extraBox();
    }

    //工具条
    _getToolBar() {
        return this.listConfig.toolBar && this.listConfig.toolBar();
    }


    //新增按钮
    _getAddAction() {
        let {
            New
        } = this.powerConfig;
        if (New) {
            if (!this.listConfig.new) {
                // console.error("please add  new in listConfig")
                return null;
            }
            if (!this.listConfig.new.action) {
                // console.error("please add action in listConfig.new")
                return null;
            }
        }
        return New ? (
            <div className={less.btnBox}>
                <Button
                    size={'large'}
                    type={'primary'}
                    {...this.listConfig.new.option}
                    onClick={() => {
                        this.listConfig.new.action(New.code, null)
                    }}
                >{
                    this.listConfig.new.defaultValue
                }
                </Button>
            </div>
        ) : null
    }

    render() {
        let title = this.listConfig.table.title || null;
        return (
            <div className={less.mainPage}>
                <Spin size={'large'} spinning={this.state.loading}>
                    {
                        this._getSearchBox()
                    }
                    {
                        this._getExtraBox()
                    }
                    {
                        this._getToolBar()
                    }
                    {
                        this._getAddAction()
                    }

                    <Table
                        key={this.state.tableKey}
                        className={less.table}
                        bordered={true}
                        columns={this._getColumns()}
                        dataSource={this.items}
                        title={() => {
                            return (<span className={less.tableTitle}>{title}</span>)
                        }}
                        pagination={{
                            total: this.state.total,
                            current: this.state.page,
                            pageSize: this.state.pageSize,
                            pageSizeOptions: ['10', '20', '50', '100', '200', '300', '500'],
                            showTotal: (total) => {
                                return `总条数：${total} 条 `
                            },
                            showQuickJumper: true,
                            showSizeChanger: true,
                            // onChange: (page, pageSize) => {
                            //     this._loadDataForNet(page, pageSize);
                            // },
                            onShowSizeChange: (page, pageSize) => {
                                this._loadDataForNet(1, pageSize);
                            }
                        }}
                        onChange={(pagination, filters, sorter) => {
                            this.tableChange(pagination, filters, sorter);
                        }}
                        rowSelection={this.listConfig.table.couldSelect ? {
                            selectedRowKeys: this.state.selectedRowKeys,
                            onChange: (selectedRowKeys) => {
                                log(selectedRowKeys);
                                this.setState({
                                    selectedRowKeys: selectedRowKeys,
                                });
                            }
                        } : null}
                        {...this.listConfig.table.option}
                    />
                </Spin>
            </div>
        );
    }


    /**
     * 改变列表查询状态
     * @param state
     */
    _showLoading(state, cb) {
        this.setState({
            loading: state || false,
        }, cb);
    }


    /**
     * 获取表数据
     * @param page    //页码
     */
    _loadDataForNet(page, pageSize, cb) {
        if (this.listConfig.table.beforeForNet) {
            let result = this.listConfig.table.beforeForNet();
            if (!result) {
                if (cb) {
                    cb();
                }
                return;
            }
        }
        let callBack = () => {
            if (this.listConfig.table.afterForNet) {
                this.listConfig.table.afterForNet();
            }
            if (cb) {
                cb();
            }
        };

        let param = {};

        if (this.listConfig.table && this.listConfig.table.option && this.listConfig.table.option.pagination === false) {

        } else {
            param.page = page || this.state.page;
            param.pageSize = pageSize || this.state.pageSize;
            this.searchParam.page = page || this.state.page;
            this.searchParam.pageSize = pageSize || this.state.pageSize;
        }
        param = Object.assign(param, this.listConfig.table.otherParam, this.searchParam);
        let sortMsg = this.state.sortMsg;
        if (sortMsg && sortMsg.type) {
            param.sortmode = sortMsg.type === "descend" ? 'DESC' : 'ASC';
            param.sortfield = sortMsg.field;
            this.searchParam.sortmode = sortMsg.type === "descend" ? 'DESC' : 'ASC';
            this.searchParam.sortfield = sortMsg.field;
        }

        let successCB = (code, msg, json, option) => {
            this.items = LXDHelp.addKey(json);
            this.setState({
                total: parseInt(option.option),
                page: param.page,
                pageSize: param.pageSize,
                loading: false,
            }, callBack);
        };
        let failureCB = (code, msg, option) => {
            this._showLoading(false, callBack);
            message.warning(msg);
        };

        if (!this.listConfig.table.apiType) {
            this.listConfig.table.apiType = "post"
        }

        this._showLoading(true);

        //调试阶段
        if (this.listConfig.table.url === 'test') {
            // 模拟请求
            let json = require('./testData.js'),
                option = {
                    option: {
                        total: 1,
                    }
                };
            setTimeout(() => {
                successCB(200, '请求成功', json, option);
            }, 500);
            return;
        }

        HttpTool[this.listConfig.table.apiType](this.listConfig.table.url, successCB, failureCB, param)
    }


    tableChange(pagination, filters, sorter) {
        // console.log(pagination)
        // console.log(filters)
        // console.log(sorter)
        this.setState({
            sortMsg: {
                type: sorter.order,
                field: sorter.field,
            }
        }, () => {
            this._loadDataForNet(pagination.current, pagination.pageSize);
        })
    }

}

export default ListPage;

let Page = null;

class ChildPage extends Component {
    render() {
        return <Page {...this.props} />;
    }
};

ListPage.ChildPage = (p) => {
    Page = p;
    return ChildPage;
};