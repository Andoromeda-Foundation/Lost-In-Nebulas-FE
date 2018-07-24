import React from "react";
// import { Button, Input } from "antd";
// import intl from "react-intl-universal";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'

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

export default Faq;