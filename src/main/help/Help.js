import React, { Component } from 'react';
import css from './Help.less';
import {message} from 'antd';
import APILXD from "../../http/APILXD";
import HttpTool from "../../tool/HttpTool";
/**O
 * 得到参数
 * @param obj
 * @returns {{}}
 */

class help {

	constructor() {
	}
	app_getParameter(obj) {

		if (this.stateP) {
			return this.stateP;
		}

        if (obj && obj.props && obj.props.location && obj.props.location.state) {
            this.stateP = obj.props.location.state
            return this.stateP;
        } else {
            return {};
        }


	}
	/**
	 * 打开页面
	 * @param obj
	 * @param path
	 * @param state
	 * @param callBack
	 */
	app_open(obj, path, state, callBack) {
		if (obj && obj.context && obj.context.router && obj.context.router.push) {
			if (path == "/") {
				//主页
			} else {
				var pathname = "";
				if (obj.context.router.location) {
					pathname = obj.context.router.location.pathname;
				}

                path = pathname+path;
                path = path.replace("//","/");
            }
            log("****************")
            log(path);
            log(obj);
            obj.context.router.push(
                {
                    pathname: path,
                    state: state
                })

		} else {
			if (callBack) {
				callBack("打开页面错误,请检查");
			} else {
				alert("打开页面错误,请检查");
				log(obj);
			}
		}

	}

	app_children(obj) {
		if (!obj.props.children) {
			return null;
		}

		return (
			<div className={css.contentFull}>
				{obj.props.children}
			</div>
		);
	}

	app_render(obj, div, option) {



		//定位最大区域显示
		div = <div className={css.contentFull}>{div}</div>

//如果显示全屏
        var main = (
            <div className={css.contentWhite}>
                {div}
                {this.app_children(obj)}
            </div>
        );
        return this.getRender(obj, main);


    }

    getRender(obj,main){

        return main;
    }


    setIntent(option){
        this.resultOption = option;

    }
    back(obj) {
        if (obj && obj.context && obj.context.router && obj.context.router.goBack) {
            //如果存在动画.关闭动画
            if(this.pageAnimOption){
                if(this.pageAnimAction){
                    this.pageAnimAction.setShowView(false);
                }else{
                    this.backPage(obj);
                }
            }else{
                log("说好的返回呢2")
                this.backPage(obj);
            }


        } else {
            log(obj);
            alert("返回出错");
        }

    }

    close(obj){
        if(this.app_getParameter(obj).callBack&&this.resultOption){
            this.app_getParameter(obj).callBack(this.resultOption);
            log("有返回数据");
        }else {
            log("无返回数据");
        }
    }
    backPage(obj){

        obj.context.router.goBack();

    }


    getUrlSearch(str) {
        var query = {};
        var name, value;
        var num = str.indexOf("?")
        if (num < 0) {
            return query;
        }

        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里

        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                query[name] = value;
            }
        }
        return query;
    }
    getImgUrl(url) {
        if(url){
            return `url(${url})`;
        }else{
            return null;
        }

    }


    randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    openScriptPage(version,fname){
	    if(!version || !fname){
            message.error('文件信息错误');
        }
        if(window.scriptHost){
	        let path = window.scriptHost + '/' + version + '/'+ fname;
	        // window.open(path);
            // let a = $("<a href='http://www.apple.com' target='_blank'>Apple</a>").get(0);
            let a = document.createElement('a');
            a.href = path;
            a.target = '_blank';

            let e = document.createEvent('MouseEvents');
            e.initEvent( 'click', true, true );
            a.dispatchEvent(e);
        }else{
	        this.loadHost(version,fname);
        }
    }

    loadHost(version,fname){
        let param = {};
        let successCB = (code, msg, json, option) => {
            window.scriptHost = json.host;
            this.openScriptPage(version,fname)
        };
        let failureCB = (code, msg) => {
            message.error(msg);
        };

        HttpTool.post(APILXD.getFileHost, successCB, failureCB, param);
    }

    copy(data){
        try {
            let oInput = document.createElement('input');
            oInput.value = JSON.stringify(data);
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            oInput.style.display = 'none';
            document.body.removeChild(oInput);

            message.success("复制成功");
        } catch (e) {
            message.success("复制失败：" + e.message)
        }
    }
}


module.exports = help;
