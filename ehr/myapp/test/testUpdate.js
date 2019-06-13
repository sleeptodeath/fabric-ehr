
'use strict';
const Ehr = require('../../../chaincode/ehr/lib/ehr.js');
var OPT = require('../interface/opt.js');
var opt = new OPT();

async function main() {

    console.log("修改:'test1', '1','{\"pname\":\"patient5\", \"age\":\"30\"}'");
    var ret1 = await opt.update("test1", "1", '{"pname":"patient5","age":"30"}')
    if (!ret1 || ret1.length == 0) {
        console.log("修改失败");
    } else {
        console.log("修改成功");
    }

    console.log("修改:'test1', '2','{\"pname\":\"patient5\", \"age\":\"30\"}'");
    var ret2 = await opt.update("test1", "2", '{"pname":"patient5", "age":"30"}')
    if (!ret2 || ret2.length == 0) {
        console.log("修改失败");
    } else {
        console.log("修改成功");
    }
}

main();

















