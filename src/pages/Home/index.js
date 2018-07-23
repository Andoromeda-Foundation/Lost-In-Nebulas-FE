import React from "react"
import intl from "react-intl-universal";
import { Button } from "antd";
import "./style.css"
// import config from "../config";

const backgroundImg = 'https://i.loli.net/2018/07/16/5b4c4a832a920.jpg'

const bannerStyle = {
    padding: `6rem`,
    color: `#fafafa`,
    width: "100%", minHeight: "48rem",
    background: `url(${backgroundImg})`, backgroundSize: 'cover'
}


export default function Home() {
    return (<div className="index-page" style={{ marginTop: "-64px" }}>
        <div className="banner" style={bannerStyle}>
            {/* <img src={Brand} alt="Dasdaq" style={{ maxWidth: "24rem" }} >

            </img> */}

            <p style={{
                opacity: 1, transform: `translate(0px, 0px)`, fontSize: `20px`,
                lineHeight: `40px`,
            }}>
                {intl.get('homepage.welcome')}
                </p>
                <div className="button-group">
                    <Button className="btn" type="primary">Btn1</Button>
                    <Button className="btn" type="primary" size="large">Btn2</Button>
                    <Button className="btn" type="primary">Btn3</Button>
                </div>
                
        </div>
        {/* <img src={logo} alt="给你比心" style={{ maxWidth: "100%" }} /> */}
    </div>)
}