import React, { Component } from 'react';
class page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ textAlign: "center", fontSize: "25px", paddingTop: "250px" }}>

                <img src="/images/logo.png" alt="" />
                <p>欢迎来到后台管理平台</p>

            </div>
        );
    }


}

export default page;