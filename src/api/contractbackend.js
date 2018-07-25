
"use strict";

var superagent = require('superagent');
var _ = require('lodash');
var async = require('async');
var request = require("request");

// var nebulas = require("nebulas"),
//     Account = nebulas.Account,
//     neb = new nebulas.Neb();
// neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io")); //test
// neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io")); //main

var netbegin = 'https://explorer.nebulas.io/test/api/';
// var NebPay = require("nebpay.js");     //https://github.com/nebulasio/nebPay
// var nebPay = new NebPay();

// // var callbacks = NebPay.config.testnetUrl;
// var callbacks = NebPay.config.mainnetUrl;   //如果合约在主网,则使用这个
var contract = '';

export default (contract) => new Promise((resolve, reject) => {

    var page = 1;
    var fetchUrl = netbegin + `tx?a=${contract}&p=${page}`
    // var fetchUrl = `https://explorer.nebulas.io/main/api/tx?a=${contract}&p=${page}`

    superagent.get(fetchUrl).end(async (err, res) => {

        var totalPage = 0;
        var txnCnt = [];
        try{
            var totalPage = res.body.data.totalPage;
            var txnCnt = res.body.data.txnCnt;
        }catch(e){
            console.log(e);
        }
        var buylist = [];
        
        var txArr = [];
        var arr = _.fill(Array(totalPage), 1);
        var index = 0;
        // console.log("合约:", contract, "交易页数:", totalPage, "交易记录:", txnCnt);
        async.eachSeries(arr, (acc, callback) => {

            index++;
            var url = netbegin + `tx?a=${contract}&p=${index}`
            // console.log(url)
            superagent.get(url).end((err, res) => {
                // console.log(res.body)
                var txnList = [];
                try{
                    var txnList = res.body.data.txnList;
                }catch(e){

                }
                _.each(txnList, (tx) => {
                    var _tx = {
                        address: tx.from.hash,
                        balance: tx.from.balance / 10 ** 18
                    }

                    var func = JSON.parse(tx.data).Function;
                    
                    // console.log(tx);
                    var one = {};
                        one.key = buylist.length + 1;
                        one.event = func;
                        one.player = tx.from.hash;
                        one.price = tx.value / 10**18;
                        one.amount = 1;
                        one.time = tx.timestamp;
                        buylist.unshift(one);

                    txArr.push(_tx);
                })

                setTimeout(function () {
                    callback(err);
                }, 100);

            });

        }, (err) => {

            var address = [];
            var arrs = [];

            _.each(txArr, function (tx) {
                if (address.indexOf(tx.address) == -1) {
                    address.push(tx.address);
                    arrs.push(tx)
                }
            })

            var totalNas = 0;

            _.each(arrs, function (tx) {
                totalNas += tx.balance;
            })

            // console.log("合约", contract, "交易页数", totalPage, "交易记录", txArr.length, "去重后地址", arrs.length);
            
            resolve(buylist);

            arrs = arrs.sort((a, b) => {
                return b.balance - a.balance;
            });

            // fetchAccountInfo(arrs);

        })
        
    });
    
});


function analyzeAccount(acc, cb) {

    var account = acc.address;

    var page = 1;
    var fetchUrl = netbegin + `api/tx?a=${account}&p=${page}`


    superagent.get(fetchUrl).end((err, res) => {

        var totalPage = 0;
        var txArr = [];
        var arr = _.fill(Array(totalPage), 1);
        var index = 0;

        async.eachSeries(arr, (acc, callback) => {

            index++;
            var url = netbegin + `api/tx?a=${account}&p=${index}`

            // console.log(url)
            superagent.get(url).end((err, res) => {

                var txnList = res.body.data.txnList;

                _.each(txnList, (tx) => {
                    txArr.push(tx)
                })

                setTimeout(function () {
                    callback(err);
                }, 100);

            });

        }, (err) => {

            var address = [];
            var arrs = [];

            var totalIn = 0;
            var totalOut = 0;

            var inCount = 0;
            var outCount = 0;

            _.each(txArr, function (tx) {

                if (tx.type == 'binary') {
                    var _value = tx.value / 10 ** 18;
                    var from = tx.from.hash;
                    var to = tx.to.hash;
                    if (account == from) {
                        // logger.error("out:", _value)
                        totalOut += _value;
                        outCount++;
                    }

                    if (account == to) {
                        // logger.error("in:", _value)
                        totalIn += _value;
                        inCount++;
                    }
                }


                if (address.indexOf(tx.from.hash) == -1) {
                    address.push(tx.from.hash);
                    arrs.push(tx)
                }

                if (address.indexOf(tx.to.hash) == -1) {
                    address.push(tx.to.hash);
                    arrs.push(tx)
                }

            })

            // console.log("账户", account, "余额:", acc.balance, "交易记录", txArr.length, "去重", arrs.length, "totalOut", totalOut, "totalIn", totalIn, "inCount", inCount, "outCount", outCount);

            cb();

        })

    });

}

function fetchAccountInfo(accounts) {

    // console.log("------------调用该合约的所有账户三维--------------")

    var totalNas = 0;

    var accountInfoArr = [];

    async.eachSeries(accounts, (acc, callback) => {

        var page = 1;
        var fetchUrl = netbegin + `api/address/${acc.address}`

        superagent.get(fetchUrl).end((err, res) => {
            // console.log(res.body.data)
            var address = res.body.data.address;
            acc.txCnt = res.body.data.txCnt;

            try {
                acc.bls = address.balance / 10 ** 18;
            } catch (e) {
                // console.log("mmm");
                // console.log(res.body);
                acc.bls = 0;
            }
            totalNas += acc.bls;

            // analyzeAccount(acc, function () {
            //     callback()
            // });

        });

    }, (err) => {
        // console.log();
        // console.log("合约", contract, "去重后账户地址", accounts.length, "总资金", totalNas);

    })
}




