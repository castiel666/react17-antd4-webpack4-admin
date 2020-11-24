/**
 * 作为弹窗内容的列表
 */
import React, {Component} from 'react';
import ListPage from "../../main/base/ListPage";

class ContentList extends ListPage {
    constructor(props){
        super(props);
    }

    base_getListConfig(){
        this.selected = this.props.defaultSelected;
        let listConfig = this.props.listConfig;

        //勾选的配置采用内部配置的实现方式
        listConfig
        &&listConfig.table
        && listConfig.table.option
        && (listConfig.table.option.rowSelection = {
            type:listConfig.table.option.rowSelType || 'checkbox',
            selectedRowKeys:this.selected,
            onChange:(selectedRowKeys,selectedRows)=>{
                // this.selected = selectedRowKeys;
                this.selected.length = 0;
                for(let key in selectedRowKeys){
                    this.selected.push(selectedRowKeys[key])
                }
                this.setState({
                    tableKey:this.state.tableKey+1,
                },()=>{
                    this.props.selectedValue(selectedRowKeys,selectedRows)
                })
            }
        });

        return listConfig;
    }
}

ContentList.defaultProps = {
    defaultSelected:[],
    listConfg:{},
}

export default ___.ChildPage(ContentList);