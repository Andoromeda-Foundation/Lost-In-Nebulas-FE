import React from "react";
import { Button, Input, Select } from "antd";
import intl from "react-intl-universal";
import Nasa from "nasa.js";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'
const Option = Select.Option;

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
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
var contract = 'n1zofV7tjSZgNqoDMLQNXuLLqdQmM2REAcL';

function BuyEvent(e) {
    var args = []
    window.Nasa.call(contract, "buy", args)
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

function SellEvent(e) {
    alert("Sell");
}

function ClaimEvent(e) {
    alert("Claim")
}


export function initializeUserInfo() {
    window.Nasa.user.getAddr()
    .then((addr) => {
        user_addr = addr;
        //alert(addr)
    })
    .catch((e) => {
        //alert('Error: ' + e)
    })

    window.Nasa.contract.set({
        default: {
            local:   'n1zofV7tjSZgNqoDMLQNXuLLqdQmM2REAcL',
            testnet: 'n1zofV7tjSZgNqoDMLQNXuLLqdQmM2REAcL',
            mainnet: 'n1zofV7tjSZgNqoDMLQNXuLLqdQmM2REAcL',
        },
        contract_article: {
            /* ... */
        },
        contract_comment: {
            /* ... */
        }
    })
}

export default function Home() {
    initializeUserInfo();
    const selectBefore = (
        <Select defaultValue="{intl.get('homepage.buy')}" style={{ width: 90 }}>
            <Option value="{intl.get('homepage.buy')}">{intl.get('homepage.buy')}</Option>
            <Option value="{intl.get('homepage.sell)}">{intl.get('homepage.sell')}</Option>
        </Select>
    )
    return (
    <div className="index-page" style={{ marginTop: "-64px" }}>
        <div className="banner" style={bannerStyle}>
            <div> Current balance </div>
            <div> {intl.get('homepage.buy')}: </div>
            <Input id="buy_amount" placeholder="{homepage.buy_amount}" />
            <Input addonBefore={ selectBefore } placeholder="Amount" />
            <Button type="primary" size="large" onClick={BuyEvent}> {intl.get('homepage.buy_button')}</Button>
            <Button type="primary" size="large" onClick={SellEvent}> {intl.get('homepage.sell_button')}</Button>
            <Button type="primary" size="large" onClick={ClaimEvent}> {intl.get('homepage.claim_button')}</Button>
                
            <p> </p>
        </div>
    </div>)
}
