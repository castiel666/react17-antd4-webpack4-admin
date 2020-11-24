import React, {Component} from 'react';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';

let TextArea = Input.TextArea;

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
                    <TextArea
                        {...this.props.option}
                        onChange={(e) => {
                            this.props.verification(this.props.data, e.target.value)
                        }}

                    /> : <div>{data.option && data.option.defaultValue}</div>
                }

            </div>
        )
    }


}


export default  Index;