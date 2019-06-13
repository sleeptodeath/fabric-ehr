
'use strict';
const Ehr = require('../../../chaincode/ehr/lib/ehr.js');
var OPT = require('../interface/opt.js');
var opt = new OPT();

async function main() {

    console.log("查询:'test1', '1'");
    var ret1 = await opt.query("test1", "1")
    if (!ret1 || ret1.length == 0) {
        console.log("查询失败");
    } else {
        let ehr = Ehr.fromBuffer(ret1);
        console.log(`{issuer : ${ehr.issuer}, ehrNumber : ${ehr.ehrNumber},issueDateTime : ${ehr.issueDateTime}, content : ${ehr.content}`);
    }

    console.log("查询'test1', '2'");
    var ret2 = await opt.query("test1", "2")
    if (!ret2 || ret2.length == 0) {
        console.log("查询失败");
    } else {
        let ehr = Ehr.fromBuffer(ret2);
        console.log(`{issuer : ${ehr.issuer}, ehrNumber : ${ehr.ehrNumber},issueDateTime : ${ehr.issueDateTime}, content : ${ehr.content}`);
    }
}

main();













