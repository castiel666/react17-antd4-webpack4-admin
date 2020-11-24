import React from 'react';
import moment from 'moment';

let TimeHelp = {

    /**
     *
     * @param time 10位时间
     * @param format 格式
     * @param withExtraMsg 是否跟随时间简信
     * @returns {string} 返回 2016/12/12
     */
    getYMDFormat(time, format, withExtraMsg) {
        var newDate = new Date();
        if (time && String(time).length < 11) {
            newDate.setTime(time * 1000);
        } else {
            newDate.setTime(time);
        }

        var showtime = this.format(newDate, format, withExtraMsg);
        return showtime;
    },
    getYMD(time, withExtraMsg) {
        return this.getYMDFormat(time, "yyyy-MM-dd", withExtraMsg);
    },
    getLineYMD(time, withExtraMsg) {
        return this.getYMDFormat(time, "yyyy/MM/dd", withExtraMsg);
    },
    getYMDHMS(time, withExtraMsg) {
        return this.getYMDFormat(time, "yyyy-MM-dd hh:mm:ss", withExtraMsg);
    },
    getYMDHM(time, withExtraMsg) {
        return this.getYMDFormat(time, "yyyy-MM-dd hh:mm", withExtraMsg);
    },
    getMD(time, withExtraMsg) {
        return this.getYMDFormat(time, "MM-dd", withExtraMsg);
    },
    getHM(time, withExtraMsg) {
        return this.getYMDFormat(time, "hh:mm", withExtraMsg);
    },
    getD(time, withExtraMsg) {
        return this.getYMDFormat(time, "dd", withExtraMsg);
    },
    getH(time, withExtraMsg) {
        return this.getYMDFormat(time, "hh", withExtraMsg);
    },

    getWeek(date) {
        // var year=date.getFullYear();
        // var month=gw_now_addzero(date.getMonth()+1);
        // var day=gw_now_addzero(date.getDate());
        // var hour=gw_now_addzero(date.getHours());
        // var minute=gw_now_addzero(date.getMinutes());
        // var second=gw_now_addzero(date.getSeconds());
        if (!date) {
            return "";
        }
        var newDate = new Date();
        newDate.setTime(date);
        var week = "";
        switch (newDate.getDay()) {
            case 0:
                week = "日";
                break;
            case 1:
                week = "一";
                break;
            case 2:
                week = "二";
                break;
            case 3:
                week = "三";
                break;
            case 4:
                week = "四";
                break;
            case 5:
                week = "五";
                break;
            case 6:
                week = "六";
                break;
            default:
                week = "";
        }
        return week;
    },
    gw_now_addzero(temp) {
        if (temp < 10) return "0" + temp;
        else return temp;
    },

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    format(date, fmt, withExtraMsg) { //author: meizz
        let o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt + (withExtraMsg ? "（" + moment(date.getTime()).fromNow() + "）" : "");
    },

    getTime(times, showms) {
        let hour = 0,
            minute = 0,
            second = 0,
            ms = 0;
        hour = Math.floor(times / (60 * 6 * 10000));
        minute = Math.floor(times / (60 * 1000)) - (hour * 60);
        second = Math.floor(times / 1000) - (hour * 60 * 60) - (minute * 60);
        ms = Math.floor(times) - (hour * 60 * 60 * 1000) - (minute * 60 * 1000) - (second * 1000);

        let getColorText = (text) => {
            if (text == '0') {
                return text;
            } else {
                return <span style={{color: '#29a6ff'}}>{text}</span>
            }
        };

        let result = <span>
                <span>{getColorText(hour)}</span>
                <span> 小时 </span>
                <span>{getColorText(minute)}</span>
                <span> 分钟 </span>
                <span>{getColorText(second)}</span>
                <span> 秒 </span>
            {
                showms ? <span><span>{getColorText(ms)}</span>
                <span> 毫秒</span></span>
                    : null
            }
                </span>;

        return result;
    },

    getTimeDHM(times) {
        let day = 0,
            hour = 0,
            minute = 0;
        day = Math.floor(times / (24 * 60 * 6 * 10000));
        hour = Math.floor(times / (60 * 6 * 10000)) - (day * 24);
        minute = Math.floor(times / (60 * 1000)) - (day * 24 * 60) - (hour * 60);

        let getColorText = (text) => {
            if (text == '0') {
                return text;
            } else {
                return <span style={{color: '#29a6ff'}}>{text}</span>
            }
        };

        let result = <span>
                <span>{getColorText(day)}</span>
                <span> 天 </span>
                <span>{getColorText(hour)}</span>
                <span> 小时 </span>
                <span>{getColorText(minute)}</span>
                <span> 分钟 </span>
                </span>;

        return result;
    }
};
export default TimeHelp;