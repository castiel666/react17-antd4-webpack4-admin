import React, {Component} from 'react';

import UpFile from "./upFile/index";

/**
 * 输入框模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let {data,option,verification} = this.props;
        return (
            <div>

                <UpFile
                    {...option}

                    onChange={(e) => {
                        data.resultValue = e;
                        log("v:"+e);
                        //去验证
                        verification(data,data.resultValue);

                    }}
                />
            </div>
        );
    }


}



export default  Index;