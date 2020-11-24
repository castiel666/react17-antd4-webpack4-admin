import React, {Component} from 'react';
import { message, Button} from 'antd';
import {DownOutlined,UpOutlined} from "@ant-design/icons";

class SearchButton extends Component {
    constructor(props) {
        super(props);


        this.state = {
            show: this.props.defaultShow,
            loadAPI: true,
            loadAPIError: null,
            parameterArr: this.props.parameterArr,
            resetCount: 0,
        }

    }

    getSearchAction(){
        return this.props.getSearchAction();
    }

    showSearch( cb) {

        if (this.state.loadAPIError) {
            message.error(this.state.loadAPIError)
            return;
        }
        if (this.state.loadAPI) {
            //api数据加载中，不可操作高级搜索
            return;
        }
        this.setState({
            show:!this.state.show
        }, cb);
    }
    render(){

        return (
            <Button
                loading={this.state.loadAPI}
                size={'large'}
                type="primary"
                onClick={() => {
                    this.showSearch(()=>{
                        this.getSearchAction().showSearch(this.state.show);
                    })
                }}
                {...this.props}
            >
                高级搜索
                {
                    this.state.show
                        ?<UpOutlined />
                        :<DownOutlined />
                }
            </Button>
        )
    }


}



export default SearchButton;