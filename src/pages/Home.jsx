import React from "react";
import { Button, Input, Select } from "antd";
import intl from "react-intl-universal";
import nasa from "nasa.js";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'
const Nasa = window.Nasa;

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
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


var user_addr;
var current_price;
var current_balance;
var contract = 'n1oD3YLFj8S3tnTo2Nau8PpSYs1jpEs6fSj';

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
            <div className='popup'>
                <div className='popup_inner'>
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
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.props.closePopup}>
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
            <div className='popup'>
                <div className='popup_inner'>
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
                    <Button type="primary" size="large" style={buttonStyle} onClick={this.props.closePopup}>
                        {intl.get('homepage.cancel_popup')}
                    </Button>
                </div>
            </div>
        );
    }
}

class Home extends React.Component {
    initializeUserInfo() {
        window.Nasa.user.getAddr()
            .then((addr) => {
                user_addr = addr
                //alert(addr)
            })
            .catch((e) => {
                alert('Error: ' + e)
            })

    
        window.Nasa.contract.set({
            default: {
                local: 'n1oD3YLFj8S3tnTo2Nau8PpSYs1jpEs6fSj',
                testnet: 'n1oD3YLFj8S3tnTo2Nau8PpSYs1jpEs6fSj',
                mainnet: 'n1oD3YLFj8S3tnTo2Nau8PpSYs1jpEs6fSj',
            }
        })
    }

    getPrice() {
        window.Nasa.query(contract, "getPrice", [])
        .then((price) => {
            current_price = price
        })
        .catch((e) => {
            alert('Error: ' + e)
        })
        window.Nasa.query(contract, "getProfitPool", [])
        .then((balance) => {
            current_balance = balance
        })
        .catch((e) => {
            alert('Error: ' + e)
        })
    }

    constructor() {
        super();
        this.initializeUserInfo();
        this.state = {
            showPopup: false
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
                    <div> Current balance: {current_balance}</div>
                    <div> User addr: {user_addr} </div>
                    <div> Current Price: {current_price} </div>

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
                            text="intl.get('homepage.buy_title')"
                            closePopup={this.toggleBuyPopup.bind(this)}
                        />
                        : null
                    }
                    {this.state.showSellPopup ?
                        <SellPopup
                            text="intl.get('homepage.sell_title')"
                            closePopup={this.toggleSellPopup.bind(this)}
                        />
                        : null
                    }
                </div>
            </div>
        );
    }
};

export default Home;