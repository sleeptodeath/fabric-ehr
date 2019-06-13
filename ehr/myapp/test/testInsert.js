
'use strict';
const Ehr = require('../../../chaincode/ehr/lib/ehr.js');
var OPT = require('../interface/opt.js');
var opt = new OPT();

async function main() {

    console.log("'test1', '1', '2020-5-20', '{\"pname\":\"patient1\", age\":\"21\"}'");
    var ret1 = await opt.insert("test1", "1", "2020-5-20", '{"pname":"patient1", age":"21"}');
    if (!ret1 || ret1.length == 0) {
        console.log("添加失败");
    } else {
        console.log("添加成功");
    }

    console.log("'test1', '1', '2020-5-20', '{\"pname\":\"patient2\", age\":\"21\"}'");
    var ret2 = await opt.insert("test1", "1", "2020-5-20", '{"pname":"patient2", age":"21"}');
    if (!ret2 || ret2.length == 0) {
        console.log("添加失败");
    } else {
        console.log("添加成功");
    }
}

main();






