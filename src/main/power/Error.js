import React, { Component } from 'react';
import { Button } from 'antd';
class page extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var { openTab,
            title,
            post,
            path,
        } = this.props;
        return (
            <div style={{ margin:"auto",height:"653px",width:"873px",background: "url('../../images/404.png')",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:'relative'}}>
                {/* <div style={{ color: "#ff0000" }}>
                    <p >==============================打开页面错误=============================</p>
                    <p>{"标题:" + title}</p>
                    <p>{"路径:" + path}</p>
                    <p>{"参数:" + JSON.stringify(post)}</p>
                </div> */}
                <div style={{ position:"absolute",top:"62%",left:"32%"}}>
                    <h2 style={{fontFamily:"MicrosoftYaHei",fontSize:"14px",color: "#FFFFFF",letterSpacing: 0,lineHeight: "16px"}}>sorry，请检查你的网络，按F5 刷新重试或联系管理员处理</h2>
                    <Button onClick={()=>{
                        this.props.closeTab();
                        }}  type="primary" style={{ width: '140px',fontSize:"12px",position:"absolute",left:"120px",top:"80px"}} size="large" >返回上一页</Button>
                </div>


            </div>
        );
    }


}

export default page;