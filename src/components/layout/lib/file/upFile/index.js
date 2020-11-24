import React, {Component} from 'react';

import message from 'antd/lib/message';
import 'antd/lib/message/style';

import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style';

import 'antd/lib/icon/style';


import RCUpload from "rc-upload";
import {Circle} from 'rc-progress';
import ReactPlayer from 'react-player'
import ImageViewer from '../../imageViewer/viewer/index.js';
import Viewer from 'viewerjs';
import DeleteOutlined from "@ant-design/icons/es/icons/DeleteOutlined";
import PlayCircleOutlined from "@ant-design/icons/es/icons/PlayCircleOutlined";
import EyeOutlined from "@ant-design/icons/es/icons/EyeOutlined";
import ExceptionOutlined from "@ant-design/icons/es/icons/ExceptionOutlined";
import less from "./style/index.less";

class UpImg extends Component {

    constructor(props) {
        super(props);

        this.ukey = 0;

        let fileList = [];
        if (this.props.fileList) {
            for (let originalUrl of this.props.fileList) {
                if (!this.checkUrl(originalUrl)) {
                    continue;
                }
                let httpType = originalUrl.split("//")[0];
                let url = originalUrl.split("//")[1];
                let domain = httpType + "//" + url.split("/")[0];
                let file = {};
                file.status = "downing";
                file.data = {
                    domain: domain,
                    path: originalUrl.replace(domain, ""),
                }
                fileList.push({
                    ukey: this.ukey,
                    file: file,

                })
                log(fileList)
                this.ukey += 1;
            }
        }

        this.addPlusItem(fileList);

        this.state = {
            fileList: fileList,

            previewView: {},
            previewVisible: false
        };

        this.ifImgAll = this.ifAllImg(this.props.fileList);
    }


    onChange(e) {
        this.props.onChange && this.props.onChange(e);
    }

    checkUrl(str) {
        return str && str.toLowerCase().indexOf("http") === 0;
    }

    //判断数组中是否都是图片的地址
    ifAllImg(list){
        if(!list || !list.length){
            return false;
        }
        for(let key in list){
            let url = list[key];
            if(!url){
                return false;
            }
            let lastNum = url.lastIndexOf('.');
            let type = url.slice(lastNum+1).toLowerCase();
            if(['bmp','jpg','png','gif','svg','jpeg'].indexOf(type)<0){
                return false;
            }
        }

        return true;
    }

    componentDidMount() {
    }

    render() {
        if(this.props.preview && this.ifImgAll){
            return <ImageViewer data={this.props.fileList}/>;
        }

        return (
            <div className={less.layout}>
                {
                    this.state.fileList.map((data, key) => {

                        return <Item

                            {...this.props}
                            key={data.ukey}
                            ukey={data.ukey}
                            data={data}
                            action={{
                                addItem: () => {
                                    this.addItem()

                                },

                                removeItem: (ukey) => {
                                    this.removeItem(ukey, () => {
                                        this.onChange(this.getParamValue())
                                    })
                                },
                                refresh: () => {
                                    //通知上级，我更新完了
                                    this.onChange(this.getParamValue())
                                },
                                showPreview: (file) => {

                                    this.showPreview(file)
                                }

                            }}


                        />
                    })
                }
                <div style={{clear: "both"}} ref={"test"}/>
                <Modal
                    key={this.state.previewVisible}
                    className={less.viewModal}
                    visible={this.state.previewVisible} footer={null}
                    onCancel={() => {
                        this.setState({previewVisible: false})
                    }}>
                    {this.state.previewView}

                </Modal>
            </div>
        )


    }

    getParamValue() {
        let n = [];
        log(this.state.fileList)
        for (let o of this.state.fileList) {

            log(o.file)
            if (!o || !o.file || !o.file.originalUrl) continue;
            n.push(o.file.originalUrl);
        }
        log(n)
        return n.toString();
    }

    showPreview(file) {
        let previewView = (<div>none</div>)
        if (file.type.indexOf("video/") === 0 || file.type.indexOf("audio/") === 0) {
            //视频类
            let h = file.type.indexOf("video/") === 0 ? document.documentElement.clientHeight * 0.7 : 40;
            previewView = (
                <ReactPlayer
                    controls={true}
                    width={"100%"}
                    height={h + "px"}
                    url={file.originalUrl}
                    playing
                />

            )

        } else if (file.type.indexOf("image/") === 0) {
            //图片类
            previewView = (
                <img alt="example" style={{maxWidth: '100%', maxHeight: '100%'}} src={file.originalUrl}/>
            )
            var img=document.createElement("img");
            img['key']=file.originalUrl;
            img['data-original']=file.originalUrl;
            img['src']=file.originalUrl;
            this.viewer = new Viewer(img,{
                scalable:false,
                fullscreen:true,
                navbar:false,
                title:false,
                zoomRatio:0.3,
                minZoomRatio:0.1,
                maxZoomRatio:10,

            });
            this.viewer.view(0)
            return;

        } else {
            //鬼知道什么类别，不处理，有可能是MIME_type
            // window.open(file.originalUrl);
            message.info("不支持此文件预览")
            return;
        }
        // previewView = file.originalUrl;
        this.setState({
            previewView: previewView,
            previewVisible: true,
        });
    }

    addPlusItem(fileList) {
        if (this.props.preview) {
            return false;
        }
        if (this.props.max <= fileList.length || (this.props.data && this.props.data.option && this.props.data.option.disabled)) {
            return false;
        }
        fileList.push({
            ukey: this.ukey,
            file: {}
        });
        this.ukey += 1;
        return true
    }

    addItem(cb) {
        if (!this.addPlusItem(this.state.fileList)) {
            return
        }
        this.setState({
            fileList: this.state.fileList,
        }, cb);
    }

    removeItem(ukey, cb) {
        for (let i = 0; i < this.state.fileList.length; i++) {
            if (ukey === this.state.fileList[i].ukey) {
                this.state.fileList.splice(i, 1);
                let last = this.state.fileList[this.state.fileList.length - 1];
                if (last && !last.file.type) {
                    //判断最后一个是否是添加
                    //存在添加不处理
                } else {
                    //添加添加按钮
                    this.addPlusItem(this.state.fileList)
                }
                this.setState({
                    fileList: this.state.fileList,
                }, cb);
                //是否需要添加
                break;
            }
        }
    }

}

class Item extends Component {


    constructor(props) {
        super(props);


        let file = this.props.data.file;
        this.state = {
            file: file,
        };

    }

    componentDidMount() {

        //如何是解析中，进行处理文件元信息
        if (this.state.file.status === "downing") {
            let file = Object.assign({}, this.state.file);
            this.callBack({error: null, file: file})
        }
    }

    render() {

        let file = this.state.file;

        return (
            <div>

                <RCUpload
                    disabled={this.props.data.option && this.props.data.option.disabled}
                    {...this.uploaderProps()}
                >
                    {this.getContentView(file)}

                </RCUpload>
            </div>

        )
    }

    getUploadIng(file) {
        let view = null;
        if (this.props.item && this.props.item.uploadIngView) {
            view = this.props.item.uploadIngView(file);
        } else {
            view = <div className={less.fill}>
                <Circle
                    percent={file.percent}
                    strokeWidth="4"
                    strokeColor="#108ee9"
                    className={less.circle}
                />
                <div className={less.itemTitlePro}>
                    <div className={less.itemTitleProCell}>
                        上传中...
                    </div>
                </div>
            </div>

        }
        return (
            <div className={less.fill}
                 onClick={(ev) => {
                     this.stopEvent(ev)
                 }}
            >
                {view}
            </div>
        )
    }

    getDownIng(file) {
        let view = null;
        if (this.props.item && this.props.item.downIngView) {
            view = this.props.item.downIngView(file);
        } else {
            view = <div className={less.fill}>
                <Circle
                    percent={95}
                    strokeWidth="4"
                    strokeColor="#108ee9"
                    className={less.circle}
                />
                <div className={less.itemTitlePro}>
                    <div className={less.itemTitleProCell}>
                        解析中...
                    </div>
                </div>
            </div>

        }
        return (
            <div className={less.fill}
                 onClick={(ev) => {
                     this.stopEvent(ev)
                 }}
            >
                {view}
            </div>
        )
    }

    getUploadButton(file) {
        let view = null;
        if (this.props.item && this.props.item.uploadButtonView) {
            view = this.props.item.uploadButtonView(file);
        } else {
            view = (
                <div className={less.fileTable}>
                    <div className={less.fileTitle}>+ 上传</div>
                </div>
            )
        }
        return (
            <div className={less.file}>
                {view}
            </div>
        )
    }

    getDoneView(file) {
        let iconType = "";

        if (file.type.indexOf("video/") === 0 || file.type.indexOf("audio/") === 0) {
            iconType = <PlayCircleOutlined
                className={less.itemActionCellSee}
                onClick={(ev) => {
                    this.props.action.showPreview(file);
                    this.stopEvent(ev)
                }}
            />;
        } else if (file.type.indexOf("image/") === 0) {
            iconType = <EyeOutlined
                className={less.itemActionCellSee}
                onClick={(ev) => {
                    this.props.action.showPreview(file);
                    this.stopEvent(ev)
                }}
            />;
        } else {
            iconType = <ExceptionOutlined />;
        }
        let view = null;
        if (this.props.item && this.props.item.doneView) {
            view = this.props.item.doneView(file);
        } else {
            view = (
                <div className={less.itemBaseFile}
                     style={{backgroundImage: "url(" + file.thumbUrl + ")"}}
                     onClick={(ev) => {
                         this.stopEvent(ev)

                     }}>
                    <div className={less.itemTitle}>{file.type.split("/")[1] || "未知"}</div>
                    <div className={less.itemAction}>
                        <div className={less.itemAction}>
                            {iconType}
                            &nbsp;&nbsp;
                            {
                                this.props.preview ? null : <DeleteOutlined
                                                                  className={less.itemActionCellDel}
                                                                  onClick={(ev) => {
                                                                      //del file
                                                                      this.props.action.removeItem(this.props.data.ukey);
                                                                      this.stopEvent(ev)

                                                                  }}/>
                            }

                        </div>
                    </div>

                </div>
            )
        }
        return (
            <div className={less.file}>
                {view}
            </div>
        )
    }


    getContentView(file) {

        if (this.props.item && this.props.item.getContentView) {
            //完全自定义
            return this.props.item.getContentView(file);
        } else {
            //默认选项
            switch (file.status) {
                case "start":
                case "uploading":
                    return this.getUploadIng(file);
                case "done":
                    return this.getDoneView(file);
                case "downing":
                    return this.getDownIng(file);
                default:
                    return this.getUploadButton(file);
            }

        }

    }


    stopEvent(ev) {
        try {
            let oEvent = ev;
            //js阻止事件冒泡
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();

            //js阻止链接默认行为，没有停止冒泡
            oEvent.preventDefault();
            return false;
        } catch (e) {
//11
        }
    }

    assign(...arr) {
        let n = {};
        if (!arr) return n;
        for (let o of arr) {
            if (!o) continue
            for (let key in o) {
                n[key] = o[key];
            }
        }
        return n;
    }

    callBack({error, file}) {
        // log(file)
        if (error) {
            this.showError(error);
        } else {
            //添加新的选择文件
            //更新当前组件

            let fileNew = this.assign(this.state.file, file)
            let upView = (fileNew) => {
                this.setState({
                    file: fileNew
                }, () => {
                    if (fileNew.status === "start") {
                        this.setState({
                            file: fileNew
                        }, () => {
                            this.props.action.addItem();
                        });
                    }

                });
            }
            if (fileNew.status === "done") {
                //获取文件信息
                this.getFileInfo(fileNew, (res) => {
                    //res.error 存在
                    //错误分为：文件不存，获取错误等。非影音类型的是获取不到文件信息的
                    //res.error   //不存在，上传到七牛成功.
                    fileNew.avinfo = res;
                    this.getResultInfo(fileNew);
                    upView(fileNew);
                    this.props.data.file = fileNew;
                    //通知上级，我更新完了
                    this.props.action.refresh();

                })

            } else if (fileNew.status === "downing") {
                //获取文件头信息
                this.getFileInfoHead(fileNew, (res) => {
                    //res.error 存在
                    //错误分为：文件不存，获取错误等。非影音类型的是获取不到文件信息的
                    //res.error   //不存在，上传到七牛成功.
                    if (res.error) {
                        fileNew.type = "other/file";
                    } else {
                        fileNew.type = res.type;
                    }
                    fileNew.status = "done"
                    //再次获取
                    this.callBack({error: null, file: fileNew})


                })

            } else {

                upView(fileNew);
            }

            file.status = "done";


        }
    }

    uploaderProps() {

        let cb = this.callBack.bind(this);
        // status: 'done', // 状态有：uploading done error removed

        return {
            action: '/cloudfile/upload',
            multiple: true,
            beforeUpload: (file) => {
                this.getBase64(file, cb);
                file.status = "before"
                file.percent = 0;
                // cb({error: null, file: file})
                // return false
                return this.verificationFile(file, cb);
            },
            onStart: (file) => {
                file.status = "start"
                file.percent = 0;
                cb({error: null, file: file})
                // 添加组件
            },
            onSuccess: (file) => {
                file.status = "done"
                file.percent = 100
                if (file.code === 200) {
                    cb({error: null, file: file})

                } else {
                    cb({error: file.message, file: file})
                    this.props.action.removeItem(this.props.data.ukey);
                }
            },
            onProgress: (step, file) => {
                file.status = "uploading"
                file.percent = Math.round(step.percent);
                cb({error: null, file: file})
            },
            onError: (err) => {
                this.showError("" + err.toString());
                this.props.action.removeItem(this.props.data.ukey);
            },
            className: less.item,
            ...this.props.rcUpload
        };
    }

    /**
     * 获取文件信息，是否在七牛上
     */
    getFileInfo(file, cb) {
        if (this.props.item && this.props.item.qiniu) {
            //七牛处理
            let url = file.data.domain + file.data.path + "?avinfo"
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        try {
                            let res = JSON.parse(xhr.responseText);
                            cb(res)
                        } catch (e) {
                            console.warn("获取文件元信息非JSON格式，不处理")
                            cb({
                                error: "获取文件元信息未知错误 status：" + xhr.status
                            })
                        }

                    } else {
                        cb({
                            error: "获取文件元信息未知错误 status：" + xhr.status
                        })
                    }
                }
            };
            xhr.open("get", url, true);
            xhr.send(null);
        } else{
            if (this.props.item && this.props.item.getFileInfo) {
                //完全自定义，定义文件类型返回
                return this.props.item.getFileInfo(file,cb);
            }else{
                cb({
                    error: "获取文件元信息错误：非七牛文件不处理"
                })
            }

        }
    }

    /**
     * 获取文件头信息，判断得到文件类型
     */
    getFileInfoHead(file, cb) {
        let url = file.data.domain + file.data.path
        if (this.props.item && this.props.item.qiniu) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        try {
                            let headers = xhr.getResponseHeader("content-type");
                            log("headers：" + headers)
                            cb({
                                type: headers
                            })
                        } catch (e) {
                            console.warn("获取头信息非JSON格式，不处理")
                            cb({
                                error: "获取头信息未知错误 status：" + xhr.status
                            })
                        }


                    } else {
                        cb({
                            error: "获取头信息未知错误 status：" + xhr.status
                        })
                    }
                }
            };
            xhr.open("head", url, true);
            xhr.send(null);
        }else{
            let lastNum = url.lastIndexOf('.');
            let type = url.slice(lastNum+1).toLowerCase();
            if (this.props.item && this.props.item.getFileInfoHead) {
                //完全自定义，定义文件类型返回
                return this.props.item.getFileInfoHead(file,cb);
            }else{
                if(type){
                    cb({
                        type: "image/"+type
                    })
                }else{
                    cb({
                        error: "获取头信息错误:无法判断文件类型"
                    })
                }
            }

        }

    }

    getResultInfo(file) {
        if (!file.data) {
            return
        }
        let fileUrl = file.data.domain + file.data.path;
        let style = this.props.thumbSize || {
            width: 100,
            height: 100,
        }
        let hasInfo = !file.avinfo.error;
        //无元信息不处理缩略图
        if (file.type.indexOf("video/") === 0 && hasInfo) {
            //视频类
            file.thumbUrl = fileUrl;
            //视频帧缩略图小图
            file.thumbUrl = fileUrl + "?vframe/jpg/offset/1/w/" + style.width + "/h/" + style.height + "";
            //视频帧缩略图
            file.originalThumbUrl = fileUrl + "?vframe/jpg/offset/1";

            //视频元信息

        } else if (file.type.indexOf("audio/") === 0 && hasInfo) {
            //音频类
            file.thumbUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAmVBMVEUAAAARldoAoNsAlf8AluUMlt0PleARltsRltsRltsPltsRltsRltsQltsRltsRltsRltsRltsSldsRldsRltsRltsRltsRltwSldsQldsRltsRltsRldsQld0KleEQltsRltsPltwPltwOl9sRldwOl90Plt4SldwQltwRltsQldsRldsRltwPld0RltsPlt0RltsQlNsSltt2wD9sAAAAMnRSTlMAdgcDChQQ+NvVU76if5vy7vz26qrI4I7lb863sCsZi2dBMRyIJCB0W5ZOk0hEeDXdPdKC9uwAAAa1SURBVHja1NqJmpowGIXhI2FTGUBx31ccl9rOuf+L6zN92qYtOB0lieG9g0+W/AlCD2d+uu6O0azdbw7STpAOmv32LDruDqe5g3pYrFfDadjhTZ1wOlytF7BZvooyflLWW+Ww0eI1HvBOg/jVg03Eetjkg5rDtYAVnEucspIsvjz/DbA5p1QgPc/xRO5qQmUmKxfPsd0lVCpZLmDePOpQuSCaw6x9RE2iHOZs4w616cRbmOG+BNQqeHFgwGlE7QYn6JZPacQ0h07OB3dVne6vt5AGhW/Qwz3TsKMDDTYhjQs3UO7a4RN0rlDLn/JJpj4Umg/4NOEcyrS6fKJuC4oc+GQHKHHk0x1RnTOjBWYOKnLbtELbRSV+n5bo+6jAa9IaTa9CR0iLhA+X+BZdj3dNHw9xJ7RM38UDHGuec6nt4H49WqiHu73QSi+4U4uWauEum4CWCja4gzegtQYePk1YMmCVawt81pJWG9b+Qb/zgc8TWi7J8QnCusmkaCLwf0PWwBD/9ZW18Ib/EJaN7rc0BT7WYE0c8KFtlzXR3dZvdn9gol9Ti3AWnYdU7Qtucr5RiwYANKnYN8fkZkqGvFLSvMnyupSUh4gBFet6pofehqZZdIlSXkBJQwhikiYuyY6SlhBnQsV2KOEnlLSEwLkGVCrxzZ7/NOTkECeUtLy43JTaNCA5rSilMqmLf40paQmRxDpW1jLGP8SI+jTwL3GJAqowEiYPHBoo4Y1DSsoOItrUqIFyLQUpbfxlywIDIXDGKavKDR7JNXDTdqJ0URQZ9ZAh7h6lnJjVZALSF2oiQ7yb/+1bKtxgxdRFhpDhq9CxDTriN5FSHxlCjsYuSkxZRSpM3VkyhEyOcxT4I1axxi9n6iVD3vVXvtqb64xfRtRHhkhB7yTwpwWrCPHTnnrJECkb5oDUZBV7/YNvMUTqeaompPGNl4ahEGZy4ItYxRQ/iIBayZDbG7wZqwhE+RcRcyG8KHlG+FX7n0hliP/RC2fBasbll9VgCD0lv+UM7zIWmAvJ8S5kNVn5ZTUZItTssxcALiwwF9JW9N3yUvrV0GBIS9FZbaN0LTIXMgGAN1YXAZiwwFjIFwBexuomAAIWmAoZAnDaVCAoXXFNhQSuulXMw4YFpkJ4VXdasEGLBcZCgn1ERVo4sMBYCBOqcsCSeskQrZaIWFTDkBgzFtUwZIY+dZIhLrXqI2RRDUNCjFhUw5ARMhbVMCRDwqIahiQIWFTDkAAsUcMQfm/vzpYUBYIogN4GFBdEUMQVZRHFrbXz/z9uul9mJgZol6nEKuzz4KtxDZYKKysTLhVQL4iLAeUpGGRQn5u9No/f2rwQa7NEqc2icUF5CgZZwKI8BYNYGFOegkFW2FKegkG26FCegkE6iClPwSBxZX+ZasSqAZiUo14Qs3hbQb0gs+KNHvWCWMVbw+oF2RZvhqoX5FS8Pa1ekGVxwYByQYYlhyiVC+KV1J0pF2QquMxpMF93UnzS0lN4aFcX5Iwv+oBE8Mcn7d+e+N1qgpi6uFLAWXGV9bFdRZC5sOJM/4gymcMfZCqoXNYdGyiXjNiDpGIKmN09vqWv374+ic1FUEl5hmsM3iAHMefxbVzHGyTCbw49zE2eHcQRcxBmgdtoxMXGHyf+XmoGcTmJOSyW4TYJMRnqYs6yT3GbMzFZ428b9q5dPWKSCDri2kU5/kPN+e/P6FEpbjElJpmwX8zGDVKTeEx0cT9ZB1cFE2IyFdgqYXDGFaFJTBxD5GPF7OA7zQWx6QluJ+IF5TGmE2LTbwpv8NINYx05erTrE6M1Sw+kftfuZVGcNjR8MoL91OsTK7OpZOfPvBWKNZRpQHelLRXeSSnv37VuU8hFQ6kTKSR6hfaGWCpzvw+Wkk9/udX2VZqy4oOUcK5J4+JVTVpJj/SaNPdOXqvduvTL4NXrjSRAY0LSmjRwh1japcrgjLvsSVL7Vx1tI+mK3qvJ+KeRhgcY0iWZGa89Iq0+Q+vqM0awPoMd6zNqE9CkeJ942s84WpmmxLz9jGyWaYi2H0CgZpceJtNYc0CvyaD5T/GFKneJwcCwqWI7Azw+WlSh1gfYaD2TKmL2NHDazKkS8w247X1i53dQSLHrK3dVsUlsl9i4doLqpB4x8VJUK7ZcEs60AlQvWfVJqP5qiecwwhkJMwsNPFF8cEgA5xDg2bSj/Z9ZhvZRgxT0aNymB7XHkQ6ZLDPLpzv5VtaAjDahN6QbDb0whcyWUTiet1wq5bbm4zBaQg1asH9f76xFd9T2Hdd0/Paou7B267d9oIPFL8Kev1pcVu2FAAAAAElFTkSuQmCC";
            file.originalThumbUrl = file.thumbUrl;
        } else if (file.type.indexOf("image/") === 0) {
            //图片类
            if(hasInfo){
                file.thumbUrl = fileUrl + "?imageView2/1/w/" + style.width + "/h/" + style.height + "";
                file.originalThumbUrl = fileUrl + "?imageView2/1";
            }else{
                file.thumbUrl = fileUrl;
                file.originalThumbUrl = fileUrl;
            }


        } else {
            //鬼知道什么类别，不处理，有可能是MIME_type
            //也有可能是上传七牛失败，被上传到了本地
            file.thumbUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAJ/ElEQVR4Xu2dTYhlRxmG62tBApndBDdZNZg4uOtTlegiLkRDJMafmI1KsokGyRDUgIjZmV0gSGaCIYMLcaMihJAQQwRx3AQkybk904sBUbRBIa5mQCRmYLqn5Ex6ZAia7lt1znfrPfe561P1vvV89XBvT/+MhZFfOzs7H9nf3/9KzvnTOeePm9lmCOHmkWPY7n0EzOzeruteA8y4BGys7XLOH9re3v5BCOEJhBiL6tH3QZCjs1rmyVEE2d3dvenSpUuvhBA+u0w4z45HAEHGY3njTtWCHLxz/D6E8KlpKrLrUQggyFEoLf9MtSCLxeKZEMJ3l49mxZgESgXZ2dn52JUrV/6aUroyZp+57FUlyGKx+GQI4Q9zgaF8jlJB+r7/tpk9nHN+IKX0F2UGU3SvEqTv+zfM7M4pirHncgQqBTmdc37XzB6MMb64XPK8ny4WZHhr3tvb++O88eicrlaQG076dIzx+zonn7ZpsSCLxWL4umP4+oNXAwRGFCTknJ9PKZ1s4Fgrr1AjyJkQwrdWfgIKXCMwpiDDfkjy3sWqEeTlEMIXuZ9tEBhbECSpF2T4sYbPtXE9aDGFIEhS9w6CIA15OZUgB0c8FWN8vKHjulWp+YiFIG5jOjxoYkGGAmspCYIcfvcknnAQZC0lQRCJ6394SSdB1k4SBDn87kk84SjIWkmCIBLX//CSzoKsjSQIcvjdk3hiBYKshSQIInH9Dy+5IkGG77g/lVIafot0li8EmclYVyXIwTcTZysJgiDI8Psgp2sxzPWdBEFqb0Yj61f5DnIdwRwlQZBGLnhtjRYEmePHLQSpvZmNrG9FkAMcT8YYf9gImqoaCFKFr53FjQky/OvWEymlp9ohVNYEQcq4NbeqNUEOPm7JS4IgzV31skItCjIHSRCk7D42t6pVQdQlQZDmrnpZoZYFUZYEQcruY3OrWhdEVRIEae6qlxVSEOTgZI/HGE+VndJ/FYL4M58kUUiQ4fwykiDIJNfVf1MxQWQkQRD/uzxJoqAgEpIgyCTX1X9TUUGalwRB/O/yJInCgjQtCYJMcl39NxUXZPjZrZMppef9yX1wIoK0NpHCPuqCHHyfpDlJEKTwQra2bA6CtCgJgrR20wv7zEWQ1iRBkMIL2dqyOQnSkiQI0tpNL+wzN0FakQRBCi9ka8vmKEgLkiBIaze9sM9cBRlwmNk3uq77aSGaqmUIUoWvncVzFmT4LxPN7JurkARB2rnjVU1mLsi1T1urkARBqq5lO4vXQJCVSIIg7dzxqiZrIoi7JAhSdS3bWbxGgrhKgiDt3PGqJmsmyDVJQggPxRh/XgXukMUIMiVdx73XUBAXSRDE8RJPGbWmgkwuCYJMeWsd915jQa5JknN+MKX0i7GRI8jYRFe035oLMhiyZ2b3xBjPjjkCBBmT5gr3WndBDtC/Y2a3d1339lijQJCxSK54HwT57wDOxhg/M9Y4EGQskivep1SQ8+fP35pzvm3F9UeN39/ffzOl9O8xNkWQMSg2sEepIA1Ub7oCgjQ9nqOXQ5Cjs1rmSQRZhlbDzyLINMNBkGm4uu9qZl/vuu6X7sEzD0SQ+QxY5i+mKyFHEKVpfXDXX8UYvzqf47RxEgRpYw7VLXLO74YQbhnrnzerC81kAwSZySCHY+Scv5NSenZGR1r5URBk5SMYr0DO+R8hhI/yLjIeUwQZj2UrO/2m67r7zGy/lULKPRBEeXr/p3vO+dVjx4597cSJE/+a4fFcj4Qgrrj9wnLOuxsbG490Xfc7v9T5JSHI/Gb6/hP92sxObW1tnTWz4fe4eS1BAEGWgKX8aM75b2b2VghhN4TwjvJZCrr/ufSPOyBIAW2WyBF4LcZ4b0lrBCmhxho1AgiiNjH6uhJAEFfchKkRQBC1idHXlQCCuOImTI0AgqhNjL6uBBDEFTdhagQQRG1i9HUlgCCuuAlTI4AgahOjrysBBHHFTZgaAQRRmxh9XQkgiCtuwtQIIIjaxOjrSgBBXHETpkYAQdQmRl9XAgjiipswNQIIojYx+roSQBBX3ISpEUAQtYnR15UAgrjiJkyNAIKoTYy+rgQQxBU3YWoEEERtYvR1JYAgrrgJUyOAIGoTo68rAQRxxU2YGgEEUZsYfV0JIIgrbsLUCCCI2sTo60oAQVxxE6ZGAEHUJkZfVwII4oqbMDUCCKI2Mfq6EkAQV9yEqRFAELWJ0deVAIK44iZMjQCCqE2Mvq4EEMQVN2FqBBBEbWL0dSWAIK64CVMjgCBqE6OvKwEEccVNmBoBBFGbGH1dCSCIK27C1AggiNrE6OtKAEFccROmRgBB1CZGX1cCCOKKmzA1AgiiNjH6uhJAEFfchKkRQBC1idHXlQCCuOImTI0AgqhNjL6uBBDEFTdhagQQRG1i9HUlgCCuuAlTI4AgahOjrysBBHHFTZgaAQRRmxh9XQkgiCtuwtQIIIjaxOjrSgBBXHETpkYAQdQmRl9XAgjiipswNQIIojYx+roSQBBX3ISpEUAQtYnR15UAgrjiJkyNAIKoTYy+rgQQxBU3YWoEEERtYvR1JYAgrrgJUyOAIGoTo68rAQRxxU2YGgEEUZsYfV0JIIgrbsLUCCCI2sTo60oAQVxxE6ZGAEHUJkZfVwII4oqbMDUCCKI2Mfq6EkAQV9yEqRFAELWJ0deVAIK44iZMjQCCqE2Mvq4EEMQVN2FqBBBEbWL0dSWAIK64CVMjgCBqE6OvKwEEccVNmBoBBFGbGH1dCSCIK27C1AggiNrE6OtKAEFccROmRgBB1CZGX1cCCOKKmzA1AgiiNjH6uhJAEFfchKkRQBC1idHXlQCCuOImTI0AgqhNjL6uBBDEFTdhagQQRG1i9HUlgCCuuAlTI4AgahOjrysBBHHFTZgaAQRRmxh9XQkgiCtuwtQIIIjaxOjrSgBBXHETpkYAQdQmRl9XAgjiipswNQIIojYx+roSQBBX3ISpEUAQtYnR15WAvyB9379kZl9yPSZhECggkHN+KaV0f8HSYCWLhjWLxeInIYRHStezDgJeBHLOZ1JKj5bkFQvS9/1JM3uuJJQ1EPAkYGaPdl13piSzWJBz587ddvXq1T+VhLIGAp4EzOzWruveLsksFmQI6/t+28y2SoJZAwEnAn2M8Y7SrCpBtre3H8g5v1AazjoITE1gY2Pjy1tbWy+X5lQJknO2xWLxipl9vrQA6yAwFYGc86sxxi+YWS7NqBJkCN3d3b3p4sWLvzWzu0pLsA4CYxPIOb9+/Pjxuzc3Ny/X7F0tyBB+4cKFD1++fPlHIYTHasqwFgIjETjddd33zGyvdr9RBLleou/7T5jZj0MIqbYY6yFQQKDPOT+WUnqjYO3/XDKqIDeIcpeZPZxzvsPMNkMIN49VmH0gcJ1AzvmfIYS/hxAGIX6WUnp9bDr/AUlJtxQDMHxJAAAAAElFTkSuQmCC";
            file.originalThumbUrl = file.thumbUrl;
            // file.thumbUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525346240331&di=cc7dbf817ef3da6d3520c4c6cd55a511&imgtype=0&src=http%3A%2F%2Fwww.uedsc.com%2Fwp-content%2Fuploads%2F2014%2F04%2FPerspectivePageViewNavigation03.jpg"
        }
        file.originalUrl = fileUrl;


    }

    verificationFile(file, cb) {

        //文件格式,由选择过滤
        //文件大小，上传前验证
        //如需要判定图片比例，重写beforeUpload
        let fileSize = this.props.size; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
        if (fileSize !== 0 && fileSize < file.size) {
            cb({
                error: '文件过大 当前文件：' + this.bytesToSize(file.size) + '  限制大小：' + this.bytesToSize(fileSize),
                image: null
            });
            return false;
        }

        return true;
    }

    getBase64(file, cb) {
        if (!this.props.hasBase64) {
            return;
        }
        // let reader = new FileReader();
        // let imgUrl = reader.readAsDataURL(file);
        // file.base64 = reader.result;

    }

    showError(e) {
        message.error(e);
    }

    bytesToSize(bytes) {
        if (bytes === 0) return '0 B';

        let k = 1024;

        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        let i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }


}

/**
 *
 * @type {UpImg}
 * size 图片大小:单位字节 default 2 M = 2097152
 * types 图片类型:["jpg,png"] default ["jpg,png"]
 * scale 图片比例:w/h = scale  例:300/150 = 2 default none
 * width 图片大小:单位 PX default auto
 * max 图片数量:单位 int default 9
 * changeImageUrl 图片上传到服务器 function (param,callBack) default none
 *
 * 示例
 * 默认
 * <upFile>
 * 上传一张正方形不超过200KB的图片
 * <upFile max={1} size={1024*200} scale={1}>
 *     atnd 初始化值
 *      {getFieldDecorator('images', {
                        valuePropName: 'file',
                        initialValue: {fileList:[{
                            url:"https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/1c950a7b02087bf46ebfd1f2fed3572c11dfcf5e.jpg",
                            urlPreview:"https://gss0.bdstatic.com/70cFfyinKgQIm2_p8IuM_a/daf/pic/item/1c950a7b02087bf46ebfd1f2fed3572c11dfcf5e.jpg"
                        }]},
                        rules: [{ required: true, message: "必填" }],
                    })(
                        <upFile max={2} />
                    )}
 *
 */

UpImg.defaultProps = {
    size: 1024 * 1024 * 2,
    rcUpload: {
        accept: "*/*",
    },
    scale: undefined,
    width: undefined,
    hasBase64: true,
    max: 9
}

export default  UpImg;