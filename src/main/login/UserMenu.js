import React, { Component } from 'react';
import css from './UserMenu.less';
import CookieHelp from "../../tool/CookieHelp";

export default class UserMenu extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showList: false, // collapse state
		};
	}

	_showList(val) {
		this.setState({
			showList: val
		})
	}
	render() {
		let { panes } = this.props, { showList } = this.state,
			paneList =  (
				panes.map((val, key) => {
					return (
						<TabItem pane={val} key={key} changePane={val.actEvt} />
					)
				 })
			) ,
			mainStyle = showList ?
				css.hovestyle:
				css.hovestyle_hide;
        let userInfo = CookieHelp.getUserInfo().info;
		return (
			<div className={css.tabSelector}
				onMouseLeave={() => setTimeout(() => this._showList(false), 200)}
			>   
				<div className={mainStyle}>
						<div
							className={css.tabSelector_label}
                            onClick={()=>{
                                let currShowState = !this.state.showList;
                                this._showList(currShowState)
                            }}
						>
							<span className={css.name}>
								{userInfo&&userInfo.name||'个人中心'}
							</span>
							<i></i>
						</div>
						<div className={css.tabSelector_content}>
							{paneList}
						</div>
				</div>
				
			</div>
		)
	}
}

UserMenu.defaultProps = {
	panes: [],
	activeKey: '',
	closePane: () => { },
	closeAllPane: () => { },
	changePane: () => { }
};

class TabItem extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { pane, closePane, changePane,activeKey } = this.props, mainStyle = pane.key == activeKey ? [css.tabItem, css.tabItem_active] : [css.tabItem];
		let dot = (<div className={css.tabItem_info_dot}></div>);
		return (
			<div className={css.tabItem}>
				<div className={css.tabItem_title}>
					<div style={css.tabItem_info_title} onClick={()=>changePane(pane.key)}>{pane.title}</div>
				</div>
			</div>
		);
	}
}

TabItem.defaultProps = {
	pane: {},
	activeKey: '',
	closePane: () => { },
	changePane: () => { }
};