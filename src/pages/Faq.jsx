import React from "react";
// import { Button, Input } from "antd";
// import intl from "react-intl-universal";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'
const contract = 'n1nEHE62HQCpzmgYFfJ9LnP4eHB2E4XPbhp'
const contractAddr = 'https://explorer.nebulas.io/#/testnet/address/n1nEHE62HQCpzmgYFfJ9LnP4eHB2E4XPbhp'

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
}

class Faq extends React.Component {
//    constructor() {
//        super();
//    }

    render() {
        return (
            <div className="index-page" style={{ marginTop: "-64px" }}>
                <div className="banner" style={bannerStyle}>
                    <div>
                    游戏背景
                        游戏背景：你好，我是侠盗一号，我们已经盗取了死星的设计图， 我们的飞船被帝国军微商了，请资助我们购买凯伯水晶返回地球。 我们回来以后，就把死星设计图交给你，保你当共和国的王。
                        支援获得了价值连城的帝国宝物的反抗军安全返回地球！反抗军首领将会把宝藏分给最后支援的人。
                    </div>
                    <div>
                        游戏规则：每购买超过 1 单位水晶，反抗军就可以再多周旋 12 小时，宝藏的价值也会增加。 gas 燃料价格等于: basePrice + k x supply。
                    </div>
                    <div>
                        basePrice = 0.000001 nas 
                    </div>
                    <div>
                        k = 0.000001 nas per cryskal                        
                    </div>
                    <div>
                        <a href={contractAddr}>合约地址：{contract}</a>
                    </div>                    
                </div>
            </div>
        );
    }
};

export default Faq;