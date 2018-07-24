import React from "react";
import { Button, Input } from "antd";
import intl from "react-intl-universal";
import nasa from "nasa.js";
import { BigNumber } from 'bignumber.js';

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'
const contract = 'n1nEHE62HQCpzmgYFfJ9LnP4eHB2E4XPbhp';
const Nasa = window.Nasa;

var user_addr;
var current_price;
var current_balance;

class NasTool {
    static fromNasToWei(value) {
      return new BigNumber('1000000000000000000').times(value);
    }
    static fromWeiToNas(value) {
      if (value instanceof BigNumber) {
        return value.dividedBy('1000000000000000000');
      }
      return new BigNumber(value).dividedBy('1000000000000000000');
    }
  }

function initializePrice() {
    var args = []
    //alert(window.Nasa.env.get())
    window.Nasa.query(contract, "getPrice", args)
        .then((price) => {

            current_price = NasTool.fromWeiToNas(price).toString()
            this.setState({
                current_price:price
            })
            alert("Price:" + current_price)
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
    window.Nasa.query(contract, "getProfitPool", args)
        .then((balance) => {
            current_balance = NasTool.fromWeiToNas(balance).toString()
            alert("Profit: " + current_balance)
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

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
}

const popupStyle = {
    position: `fixed`,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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
                    <h1>{this.props.text}</h1>
                    <p> </p>
                    <Input
                        {...this.props}
                        id="buy_amount"
                        placeholder="Input a amount in NAS"
                        maxLength="25"
                    />
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
                    msg = '您已取消交易！'
                }
                alert(msg)
            })
    }

    render() {
        return (
            <div className='popup' style={popupStyle}>
                <div className='popup_inner' style={popupInnerStyle}>
                    <h1>{this.props.text}</h1>
                    <p> </p>
                    <Input
                        {...this.props}
                        id="sell_amount"
                        placeholder="Input a amount in Token"
                        maxLength="25"
                    />
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


class Home extends React.Component {

    componentDidMount(){

    }
    initializeUserInfo() {
        window.Nasa.user.getAddr()
            .then((addr) => {
                user_addr = addr
                this.setState({
                    user_addr:addr
                })
                //alert(addr)
            })
            .catch((e) => {
                alert('Error: ' + e)
            })


        window.Nasa.contract.set({
            default: {
                local: contract,
                testnet: contract,
                mainnet: contract,
            }
        })
    }

    getPrice() {
        // initializePrice();
        var args=[];
        window.Nasa.query(contract, "getPrice", args)
            .then((price) => {
                current_price = price
                this.setState({
                    current_price:price
                })
                alert("Price:" + current_price)
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

        window.Nasa.query(contract, "getProfitPool", args)
            .then((balance) => {
                current_balance = balance;
                this.setState({
                    current_balance: balance
                })
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

    constructor() {
        super();
        window.Nasa.env.set("testnet")
       this.initializeUserInfo();
        this.getPrice();
        this.state = {
            showPopup: false,
            current_balance: null,
            user_addr: null,
            current_price: null
        };
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
        return (
            <div className="index-page" style={{ marginTop: "-64px" }}>
                <div className="banner" style={bannerStyle}>
                    <div> {intl.get("homepage.wallet_balance")}: {this.state.current_balance} NAS</div>
                    <div> {intl.get("homepage.user_addr")}: {this.state.user_addr} </div>
                    <div> {intl.get("homepage.current_price")}: {this.state.current_price} </div>
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
                </div>
            </div>
        );
    }
};

export default Home;