import React, {Component} from 'react';
import ReactDOM from "react-dom";

import {Cascader} from 'antd';



/**
 * 联选
 */
class CascaderSelect extends Component {
    constructor(props) {
        super(props);
    }
    _initDefaultValue(data){
        return data.option.defaultValue||[];
    }
    //    this.props.verification(data,data.resultValue);
    render(){
        // alert(JSON.stringify(this.props.data.data))
        return (
            <div ref={(ref)=>{this.cascaderBox = ref;}}>
                <Cascader
                    getPopupContainer={()=>{
                        return ReactDOM.findDOMNode(this.cascaderBox);
                    }}
                    {...this.props.option}
                    options={this.props.data.data||[]}
                    onChange={(e)=>{
                        // log(e);
                        this.props.verification(this.props.data, e)
                    }
                    }
                />
            </div>
        );
    }


}


export default CascaderSelect;