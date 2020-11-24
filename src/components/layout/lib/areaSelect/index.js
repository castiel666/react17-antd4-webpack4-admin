import React, {Component} from 'react';
import AreaSelect from "./area/index";

/**
 * 输入框模板
 */
class LayoutAreaSelect extends Component {
    constructor(props) {
        super(props);
    }
    _mergeParameter(parameter,resultValue){
        _.merge(parameter,resultValue);
    }

    _verParameter(data){
       return  this.rightObject.verValue(data);
    }
    render(){
        let {option,data,verification} = this.props;
        return (
            <div>
                <AreaSelect
                    ref={(ref)=>{
                        this.rightObject = ref;
                    }}
                    {...option}
                    onChange={(e) => {
                        data.resultValue = e;
                        //去验证
                        verification(data,data.resultValue);

                    }}
                />
            </div>
        );
    }


}



export default  LayoutAreaSelect;