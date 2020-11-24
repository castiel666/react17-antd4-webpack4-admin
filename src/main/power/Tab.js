import React, { Component } from 'react';
import {Icon, Tabs} from 'antd';
import css from './Tab.less';
import TabConfig from './TabConfig.js';
import TabSelector from './TabSelector';
import NonePage from './NonePage.js';
import {CloseOutlined} from "@ant-design/icons"

const TabPane = Tabs.TabPane;

class page extends Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [

        ];
        this.state = {
            activeKey: "0",
            panes,

            upDateKey:0,
        };
        if (this.props.openTab) {
            this.props.openTab(this.openTab.bind(this));
        }
        if (this.props.action) {
            this.props.action({
                closeAllTab: this.closeAllTab.bind(this),
                closeOtherTab: this.closeOtherTab.bind(this),
                openTab: this.openTab.bind(this),
            });
        }
    }

    /**
     * 关闭所有选项卡
     */
    closeAllTab() {
        let indexPane = this.state.panes.slice(0, 1);
        this.tabSelector._showList(false);
        this.props.onTabItemChange();
        this.setState({ panes: indexPane, activeKey: indexPane[0].key });
    }
    /**
     * 关闭除自己之外的所有选项卡
     */
    closeOtherTab() {
        log(this.state.activeKey)
        let prevPanes = this.state.panes;
        const panes = prevPanes.length > 0 ? prevPanes.slice(0, 1).
            concat(prevPanes.filter(pane => pane.key === this.state.activeKey)) : void 0;
        this.setState({ panes });
    }
    closeTab(activeKey) {
        setTimeout(()=>{
            this.remove(activeKey)
        },0)
    }

    openTab(obj) { // obj: { title:string, path:string, id:hash }
        //添加上此选项
        const panes = this.state.panes.slice();

        const activeKey = `newTab${this.newTabIndex++}__${obj.pathKey}`;
        //search tab
        let index = -1;
        for (let i = 0; i < panes.length; i++) {
            let p = panes[i];
            if (p.path == obj.path) {
                index = i;
                break;
            }
        }

        //配置
        let tap = TabConfig.getTabConfig(obj,activeKey, this.openTab.bind(this),
            () => {
                this.closeTab(activeKey);
            },
            obj.callBack,this.getCurrentAcitveKey.bind(this));

        if (index < 0 || tap.multiple) {
            panes.push(tap);
        } else {
            panes[index] = tap;
        }
        this.props.onTabItemChange(activeKey);
        this.setState({ panes, activeKey });
    }

    getCurrentAcitveKey(){
        return this.state.activeKey;
    }
    onChange(activeKey) {
        log(activeKey);
        this.props.onTabItemChange(activeKey);
        this.setState({ activeKey });
    }
    onEdit(targetKey, action) {
        this[action](targetKey);
    }
    remove(targetKey) {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.props.onTabItemChange(activeKey);
        this.setState({ panes, activeKey });
    }
    refresh(targetKey){
        let activeKey = this.state.activeKey;

        let panes = this.state.panes;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                pane.key = 'R'+ pane.key;
                activeKey = pane.key;
            }
        });

        log(panes);
        this.props.onTabItemChange(activeKey);
        this.setState({ panes, activeKey});

    }

    render() {
        let { panes,activeKey } = this.state,
            tabExtraBtn = (panes.length > 1
                ? <TabSelector
                    panes={this.state.panes.slice(1)}
                    activeKey={activeKey}
                    ref={(a) => this.tabSelector = a}
                    closeAllPane={() => this.closeAllTab()}
                    closePane={(target) => this.closeTab(target)}
                    changePane={(target) => { this.onChange(target) }}
                    refresh={(target)=>{this.refresh(target) }}
                />
                : null);
        return (
            <div className={css.main2}>
                {
                    this.state.panes && this.state.panes.length > 0
                        ?
                        <Tabs
                            key={'Tabs_'+this.state.upDateKey}
                            hideAdd={true}
                            className={css.main}
                            onChange={this.onChange.bind(this)}
                            activeKey={this.state.activeKey}
                            type="editable-card"
                            onEdit={this.onEdit.bind(this)}
                            tabBarExtraContent={tabExtraBtn}
                        >
                            {
                                this.state.panes.slice(0).map(
                                    pane =>
                                        <TabPane
                                            className={css.content}
                                            closeIcon={pane.closable?<CloseOutlined/>:<span></span>}
                                            tab={pane.title} key={pane.key}>{pane.getView()}</TabPane>
                                )
                            }
                        </Tabs>
                        :
                        <NonePage />
                }
            </div>
        );
    }


}

export default page;