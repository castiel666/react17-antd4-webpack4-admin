import React, {Component} from 'react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style';
import moment from "moment"
import ReactDOM from "react-dom";

/**
 * 日期选择模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    date = (value, dateString) => {
        this.props.verification(this.props.data, value)
    }

    render() {
        let {data} = this.props;
        return (
            <div ref={(ref)=>{this.datePickerBox = ref;}}>
                {(data.purpose == "edit" || !data.purpose) ?
                    <DatePicker
                        size={"middle"}
                        getCalendarContainer={()=>{
                            return ReactDOM.findDOMNode(this.datePickerBox);
                        }
                        }
                        {...this.props.option}
                        onChange={this.date}
                    /> :
                    <div>{data.option && data.option.defaultValue && moment(data.option.defaultValue).format("YYYY-MM-DD")}</div>
                }

            </div>
        )
    }


}


export default  Index;