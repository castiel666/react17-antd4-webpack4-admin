import React from "react";

class CutDown extends React.Component {
    constructor(props) {
        super(props);

        this.setTime = this.props.setTime;
        this.state = {
            str: ''
        };
    }

    componentDidMount() {
        this.startTimeInterval();
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    startTimeInterval() {
        this.doCutDown();
        this.interval = setInterval(() => {
            this.doCutDown();
        }, 15000)
    }

    doCutDown() {
        let result = '';
        let currTime = new Date();
        let times = this.props.setTime - currTime;
        if (times <= 0) {
            result = <span style={{color: '#e4393c'}}>已经结束</span>;
        } else {
            times = Math.floor(times / 1000);
            let day = 0,
                hour = 0,
                minute = 0,
                second = 0;//时间默认值
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (day <= 9) day = '0' + day;
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;

            result = <span>
                <span>{this.getColorText(day)}</span>
                <span> 天 </span>
                <span>{this.getColorText(hour)}</span>
                <span> 小时 </span>
                <span>{this.getColorText(minute)}</span>
                <span> 分钟</span>
                </span>;
            log(result);
        }
        this.setState({
            str: result,
        })
    }

    getColorText(text) {
        if (text === '00') {
            return text;
        } else {
            return <span style={{color: '#29a6ff'}}>{text}</span>
        }
    }

    render() {
        return (
            <span>{this.state.str}</span>
        )
    }
}

export default CutDown;