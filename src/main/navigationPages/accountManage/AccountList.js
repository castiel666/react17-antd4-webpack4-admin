import React from 'react';
import ListPage from '../../base/ListPage.js';
import less from './AccountManage.less';
import APILXD from '../../../http/APILXD.js';
import ModalDel from '../../../components/modalDelete/ModalDelete.js';
import {Modal,message} from 'antd';
import HttpTool from "../../../tool/HttpTool";
const ModalDelete = new ModalDel();
class AccountList extends ListPage {
    constructor(props) {
        super(props);
    }

    base_getListConfig() {
        return {
            table: {
                columns: this.getTableColumns(),
                url: APILXD.getAdminList,
                otherParam: null,
            },
            new: {
                defaultValue: '创建新账号',
                action: () => {
                    this.props.openTab({
                        path: 'AddAccount',
                        title: '新建账号',
                        post: {
                            parent: this.props
                        }
                    })
                }
            }
        }
    }

    changeAccountStatus(id,status){
        let param = {
            id,
            status,
        };
        let successCB = (code,msg,json,option)=>{
            this.setState({loading:false},()=>{
                message.success('操作成功');
                this._loadDataForNet();
            });
        };
        let failureCB = (code,msg)=>{
            this.setState({loading:false},()=>{
                message.error(msg);
            });
        };

        this.setState({loading:true});

        HttpTool.post(APILXD.enableAdmin,successCB,failureCB,param);
    }


    /**
     *  列表数据配置
     */
    getTableColumns() {
        return [
            {
                title: '账号',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '最后登录ip',
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render:(text)=>{
                    return text==1?<span style={{color:'green'}}>启用</span>:<span style={{color:'red'}}>禁用</span>
                }
            },
            {
                title: '操作',
                width: 250,
                render: (text, record, index) => {
                    return (<div>
                        {
                            this.powerConfig.Edit
                                ?(  <div
                                    className={record.status==1?less.btnDelete:less.btnEdit}
                                    onClick={() => {
                                        let newStatus = record.status==1?2:1;
                                        Modal.confirm({
                                            title:'提示',
                                            content:<div>
                                                <span>是否 </span>
                                                {record.status==1?<span style={{color:'red'}}>禁用</span>:<span style={{color:'green'}}>启用</span>}
                                                <span> {record.name} ?</span>
                                            </div>,
                                            onOk:()=>{this.changeAccountStatus(record.id,newStatus)}
                                        })
                                    }}
                                >{record.status==1?'禁用':'启用'}
                                </div>)
                                :null
                        }
                        {
                            this.powerConfig.Edit
                                ?(  <div
                                    className={less.btnEdit}
                                    onClick={() => {
                                        this.props.openTab({
                                            path: 'AddAccount',
                                            title: '编辑账号',
                                            post: {
                                                id: record.id,
                                                parent: this.props
                                            }
                                        })
                                    }}
                                >编辑
                                </div>)
                                :null
                        }
                        {
                            this.powerConfig.Delete
                            ?(<div
                                    className={less.btnDelete}
                                    onClick={() => {
                                        ModalDelete.show({
                                                title: "提示",
                                                okTitle: "确定",
                                                closeTitle: "取消",
                                            },
                                            {}
                                            ,
                                            {
                                                otherParam: {id: record.id},
                                                content: record.name,
                                                url: APILXD.delAdmin,
                                                apiType: 'post',
                                                tip: '删除后不可恢复',
                                                callBack: (state) => {
                                                    //删除成功回调
                                                    state === "success" && this._loadDataForNet();
                                                }
                                            });
                                    }}
                                >删除
                                </div>)
                            :null
                        }
                    </div>)
                }
            },
        ]
    }
}

export default AccountList;