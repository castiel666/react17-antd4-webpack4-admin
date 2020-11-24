import React, {Component} from 'react';
import less from './index.less';
import CookieHelp from "../../tool/CookieHelp";
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }


    render() {
        return (
            <div className={less.mainPage}>
                <div className={less.container}>
                    <img
                        alt={"indexImg"}
                        className={less.indexPageImg}
                        src={require('../../images/indexPageImg.png')}
                    />
                    <div className={less.textBox}>
                        <div className={less.title}>
                            {this.getTime()}
                            {this.getUserName()}
                        </div>
                        <div className={less.noteText}>后台管理平台</div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 根据本地时间判断上午/下午/晚上
     */
    getTime() {
        let time = parseInt((new Date()).getHours());
        let text = 'hello！';
        if (0 <= time && time < 6) {
            text = '凌晨好！';
        } else if (6 <= time && time < 12) {
            text = '上午好！';
        } else if (12 <= time && time < 18) {
            text = '下午好！';
        } else if (18 <= time && time < 24) {
            text = '晚上好！';
        }
        //其余时间 显示 hello

        return text;
    }

    /**
     * 获取用户名称
     */
    getUserName() {
        let loginInfo = CookieHelp.getUserInfo();
        if (loginInfo) {
            return loginInfo.info&&loginInfo.info.name;
        }
        return '';
    }
}

export default page;
