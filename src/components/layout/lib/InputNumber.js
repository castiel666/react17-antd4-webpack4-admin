import React, {Component} from 'react';
import InputNumber from 'antd/lib/input-number';
import 'antd/lib/input-number/style';

/**
 * 输入框模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props;

        return (
            <div>
                {(data.purpose == "edit" || !data.purpose) ?
                    <InputNumber
                        {...this.props.option}
                        onChange={(value) => {
                            this.props.verification(this.props.data, value)
                        }}/> : <div>{data.option && data.option.defaultValue}</div>
                }
            </div>
        );
    }
}


export default  Index;
