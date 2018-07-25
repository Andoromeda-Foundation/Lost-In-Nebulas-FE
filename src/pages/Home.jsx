import React, { PureComponent } from "react";
import intl from "react-intl-universal";
import "nasa.js";
// import styles from './timing.less';
import { NasTool } from "../api/tool";
import moment from 'moment'
import { Button, Input, Table } from "antd";
import getcontract from "../api/contractbackend.js";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'
const contract = 'n1vhZgBFYt7AE6nP3VFap9c67VPqn1eFoTi';

// var buyList = [
//     { key: "1", player: "猴子", amount: "100", price: "20", time: "2018/7/24 下午10:32:45" },
// ]

const columns = [{
    title: '玩家',
    dataIndex: 'player',
    key: 'player',
}, {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount',
    defaultSortOrder: 'descend',
    sorter: (a, b) => parseInt(a.BTC, 10) - parseInt(b.BTC, 10),
}, {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    defaultSortOrder: 'descend',
    sorter: (a, b) => parseInt(a.ETH, 10) - parseInt(b.ETH, 10),
}, {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    defaultSortOrder: 'descend',
    sorter: (a, b) => parseInt(a.EOS, 10) - parseInt(b.EOS, 10),
}];

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
}

const popupStyle = {
    position: `fixed`,
    width: "100%",
    height: "70%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
}

const popupInnerStyle = {
    position: 'absolute',
    left: '25%',
    right: '25%',
    top: '25%',
    bottom: '25%',
    margin: 'auto',
    background: `white`
}

const buttonStyle = {
    margin: "0.5rem"
}

const headerStyle = {
    background: '#FFA940',
    height: '15%',
    color: '#fff'
}
const lableStyle = {
    marginLeft: "0.5rem",
    color: "#000",
    float: "left"
}
const timingStyle = {
    color: '#fff',
    fontSize: '3rem'
}
// const titleStyle = {
//     opacity: 1, transform: `translate(0px, 0px)`,
//     fontSize: `68px`,
//     color: `#fafafa`,
//     fontWeight: 600,
//     lineHeight: `76px`,
//     margin: `8px 0 28px`,
//     letterSpacing: 0
// }

function ClaimEvent(e) {
    var args = []
    var option = {}
    window.Nasa.call(contract, "claim", args, option)
        .then((payId) => {
            setTimeout(() => {
            }, 5000)
        })
        .catch((e) => {
            let msg = e.message
            if (msg === window.Nasa.error.TX_REJECTED_BY_USER) {
                msg = '您已取消交易！'
            }
            alert(msg)
        })
}

class BuyPopup extends React.Component {
    BuyEvent(e) {
        var args = []
        var option = {
            "value": document.getElementById("buy_amount").value
        }
        window.Nasa.call(contract, "buy", args, option)
            .then((payId) => {
                setTimeout(() => {
                }, 5000)
            })
            .catch((e) => {
                let msg = e.message
                if (msg === window.Nasa.error.TX_REJECTED_BY_USER) {
                    msg = '您已取消交易！'
                }
                alert(msg)
            })
    }

    render() {
        return (
            <div className='popup' style={popupStyle}>
                <div className='popup_inner' style={popupInnerStyle}>
                    <h1 style={headerStyle}>{this.props.text}</h1>
                    <div style={lableStyle}>Nas:</div>
                    <Input
                        {...this.props}
                        id="buy_amount"
                        placeholder="Input a amount in NAS"
                        maxLength="25"
                    />
                    <div style={lableStyle}>
                        Gas:
                    </div>
                    <Input id="gas" value="200000" placeholder="Input a amount in gas" maxLength={25} />
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.BuyEvent}>
                        {intl.get('homepage.buy_button')}
                    </Button>
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.props.close_popup}>
                        {intl.get('homepage.cancel_popup')}
                    </Button>
                </div>
            </div >
        );
    }
}

class SellPopup extends React.Component {
    SellEvent(e) {
        var args = [document.getElementById("sell_amount").value]
        var option = {}

        window.Nasa.call(contract, "sell", args, option)
            .then((payId) => {
                setTimeout(() => {
                }, 5000)
            })
            .catch((e) => {
                let msg = e.message
                if (msg === window.Nasa.error.TX_REJECTED_BY_USER) {
                    msg = intl.get("homepage.tx_rejected_msg");
                }
                alert(msg)
            })
    }

    render() {
        return (
            <div className='popup' style={popupStyle}>
                <div className='popup_inner' style={popupInnerStyle}>
                    <h1 style={headerStyle}>{this.props.text}</h1>
                    <div style={lableStyle}>Nas:</div>
                    <Input
                        {...this.props}
                        id="sell_amount"
                        placeholder="Input a amount in Token"
                        maxLength="25"
                    />
                    <div style={lableStyle}>
                        Gas:
                    </div>
                    <Input id="gas" value="200000" placeholder="Input a amount in gas" maxLength={25} />
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.SellEvent}>
                        {intl.get('homepage.sell_button')}
                    </Button>
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.props.close_popup}>
                        {intl.get('homepage.cancel_popup')}
                    </Button>
                </div>
            </div>
        );
    }
}

class Timing extends PureComponent {
    state = {
        endTime: '2018/07/28 15:39:10',
        day: '0',
        hour: '00',
        minute: '00',
        second: '00',
    }
    componentWillMount() {
        this.timer = setInterval(
            () => {
                let loss = '';
                const M = moment().format('MM');
                const D = moment().format('DD');
                const Y = moment().format('YYYY');
                const S = moment().format('HH:mm:ss');
                const now = `${Y}/${M}/${D} ${S}`;
                const pre = `${Y}/${M}/${D} 23:59:59`;
                // loss = parseInt((new Date(this.state.endTime) - new Date(now)) / 1000, 10);
                loss = parseInt((new Date(pre) - new Date(now)) / 1000, 10);
                if (loss < 0) {
                    this.setState({
                        day: '0',
                        hour: '00',
                        minute: '00',
                        second: '00',
                    });
                    clearInterval(this.timer);
                    return;
                }
                const day = parseInt((loss * 1) / 86400, 0);
                loss = (loss * 1) % 86400;
                let hour = parseInt((loss * 1) / 3600, 0);
                loss = (loss * 1) % 3600;
                let minute = parseInt((loss * 1) / 60, 0);
                let second = (loss * 1) % 60;
                if (hour * 1 < 10) {
                    hour = `0${hour}`;
                }
                if (minute * 1 < 10) {
                    minute = `0${minute}`;
                }
                if (second * 1 < 10) {
                    second = `0${second}`;
                }
                this.setState({
                    day,
                    hour,
                    minute,
                    second,
                });
            },
            1000
        );
    }
    render() {
        const { state } = this;
        return (
            <div>
                <h1 style={timingStyle}>{state.hour}:{state.minute}:{state.second}</h1>
            </div>
        );
    }
}

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            showPopup: false,
            current_balance: null,
            current_price: null,
            buyList: null
        };

    }

    async fetchPriceAndBalance() {
        const price = await window.Nasa.query(contract, "getPrice", [])
        const balance = await window.Nasa.query(contract, "getProfitPool", [])
        const current_price = NasTool.fromWeiToNas(price).toString()
        const current_balance = NasTool.fromWeiToNas(balance).toString()
        return { current_price, current_balance }
    }

    async getList() {
        return getcontract(contract)
    }

    componentWillMount() {
        window.Nasa.env.set("testnet")
        window.Nasa.contract.set({
            default: {
                local: contract,
                testnet: contract,
                mainnet: contract,
            }
        })
    }

    async componentDidMount() {
        const { current_price, current_balance } = await this.fetchPriceAndBalance();
        this.setState({ current_price, current_balance })
        const buyList = await this.getList();
        this.setState({ buyList })
    }

    toggleBuyPopup() {
        this.setState({
            showBuyPopup: !this.state.showBuyPopup
        });
    }

    toggleSellPopup() {
        this.setState({
            showSellPopup: !this.state.showSellPopup
        });
    }

    render() {
        const { account } = this.props
        const { current_balance, current_price, buyList } = this.state
        return (
            <div className="index-page" style={{ marginTop: "-64px" }}>
                <div className="banner" style={bannerStyle}>
                    <div> {intl.get("homepage.contract_balance")}: {current_balance} NAS</div>
                    <div> {intl.get("homepage.user_addr")}: {account} </div>
                    <div> {intl.get("homepage.current_price")}: {current_price} </div>
                    <Timing />
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.toggleBuyPopup.bind(this)}>
                        {intl.get('homepage.buy_button')}
                    </Button>
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.toggleSellPopup.bind(this)}>
                        {intl.get('homepage.sell_button')}
                    </Button>
                    <Button type="primary" size="large" style={buttonStyle} onClick={ClaimEvent}>
                        {intl.get('homepage.claim_button')}
                    </Button>
                    {this.state.showBuyPopup ?
                        <BuyPopup
                            text={intl.get('homepage.buy_title')}
                            close_popup={this.toggleBuyPopup.bind(this)}
                        />
                        : null
                    }
                    {this.state.showSellPopup ?
                        <SellPopup
                            text={intl.get('homepage.sell_title')}
                            close_popup={this.toggleSellPopup.bind(this)}
                        />
                        : null
                    }

                    <div>
                        游戏背景：支援获得了价值连城的帝国宝物的反抗军安全返回地球！反抗军首领将会把宝藏分给最后支援的人。
                    </div><div>
                        游戏规则：每购买至少 1 单位 gas 燃料，反抗军就可以再多周旋 24 小时。宝藏的价值也会增加。
                    <div>gas 燃料价格等于: basePrice + k x supply</div>
                    </div>
                    <Table dataSource={buyList} columns={columns} style={{ background: `white` }} />
                </div>
            </div>
        );
    }
};

export default Home;