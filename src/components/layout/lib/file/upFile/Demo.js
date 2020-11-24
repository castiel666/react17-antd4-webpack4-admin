import React, {Component} from "react";
import UpImg from './index';
import css from './Demo.less';


class Index extends Component {

    render() {
        const style = {
            width: 98,
            height: 98,
        }

        let fileList = [
            "http://p7q2rvr0g.bkt.clouddn.com/cloudfile/IBMwumAL3V4YXE-b_8h7HbxZ.png",
            // "http://p7q2rvr0g.bkt.clouddn.com/cloudfile/d20vAfjhn13xSXlg6Qgt6FKD.png",
            // "http://p7q2rvr0g.bkt.clouddn.com/cloudfile/L3o7vfTC7X9jvtG-llNDWyR0.mp4",
            // "http://p7q2rvr0g.bkt.clouddn.com/cloudfile/aOiOzGxFoHWINKFYw9cb2pio.apk",
        ]

        return (
            <div>


                <div style={{width: 800}}>
                    <UpImg
                        item1={{
                            uploadIngView: (file) => {
                                return (
                                    <div
                                    >
                                        <div>上传中...{file.percent}</div>
                                    </div>
                                )
                            },
                            uploadButtonView: (file) => {
                                return (
                                    <div
                                        className={css.uploadButton}
                                    >
                                        <div>上传视图修改</div>
                                    </div>
                                )
                            }
                        }}
                        ref={(ref) => {
                            this.upImg = ref;
                        }}
                        fileList={fileList}
                        size={1024 * 5000}
                        thumbSize={{
                            width: 300,
                            height: 200,
                        }}
                        rcUpload={{
                            beforeUpload22: (file) => {
                                console.log('beforeUpload111', file);
                                //校验上传,重写此方法，不生效
                                return false;
                            },
                            accept: "*/*",
                            className: css.item,
                        }}
                        max={5}
                        changeImageUrl={(param, cb) => {
                            log(param)
                            //把base64转成URL
                            // this.changeImageUrl(param,cb);
                        }}/>
                    <div onClick={() => {
                        //得到上传参数

                        let value = this.upImg.getParamValue();
                        log(value)


                    }}>获取当前文件信息
                    </div>

                    <br/>

                </div>
            </div>
        );
    }

}

export default  Index;
