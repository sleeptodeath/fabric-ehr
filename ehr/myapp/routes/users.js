var express = require('express');
var router = express.Router();
const Ehr = require('../../../chaincode/ehr/lib/ehr.js');
var OPT = require('../interface/opt.js');
var db = require('../config.js');
var opt = new OPT();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.cookies.username) {
    res.redirect("../login.html");
    console.log("未登录");
  } else {
    // res.render('user',{ user: req.cookies.username});
    if (req.cookies.identity=='医生') {
      queryString = "select * from relation where issuer=" + "'" + req.cookies.username + "'" + ";";
    } else {
      queryString = "select * from relation where pname=" + "'" + req.cookies.username + "'" + ";";
    }

    db.query(queryString, function(err, rows) {
      if (err) {
        res.render('user', {datas:[], user:req.cookies.username, identity:req.cookies.identity});
      } else {
        res.render("user", {datas:rows, user:req.cookies.username, identity:req.cookies.identity});
      }
    });
  }
});


router.post('/', function(req, res, next) {
  res.render('user', { title: req.cookies.username, identity:req.cookies.identity});
});

router.get('/logout.html', function(req, res, next) {
  res.clearCookie('username');
  res.clearCookie('password');
  res.clearCookie('identity');
  res.redirect("../login.html");
});

router.get('/create.html', function(req, res, next) {
  if (!req.cookies.username) {
    res.redirect("../login.html");
    console.log("未登录");
  } else {
    if (req.cookies.identity=='医生')
      res.render('create', {user: req.cookies.username, ehrID:new Date().getTime()});
    else
      res.render('404');
  }
});

router.get('/tables.html', function(req, res, next){
  if (!req.cookies.username) {
    res.redirect("../login.html");
  } else {

  if (req.cookies.identity=='医生') {
    queryString = "select * from relation where issuer=" + "'" + req.cookies.username + "'" + ";";
  } else {
    queryString = "select * from relation where pname=" + "'" + req.cookies.username + "'" + ";";
  }

  db.query(queryString, function(err, rows) {
    if (err) {
      res.render('tables', {datas:[], user:req.cookies.username, identity:req.cookies.identity});
    } else {
      res.render("tables", {datas:rows, user:req.cookies.username, identity:req.cookies.identity});
    }
  });
  }
});

router.get('/query/:username/:id', function(req, res, next) {
  // res.render('display', {ehrid:req.params.id});
  if (!req.cookies.username) {
    res.redirect("../login.html");
  } else {
  console.log(req.params.username+" " + req.params.id);
  opt.query(req.params.username, req.params.id).then(function(result) {
    if (!result || result.length == 0) {
      res.render("display", {issuer:"", ehrNumber:"", content:"", user:req.cookies.username, identity:req.cookies.identity});
        // res.render('404');
    } else {
        var ehr = Ehr.fromBuffer(result);

        console.log(`${ehr.issuer}'s ehr : ${ehr.ehrNumber} successfully issued `);
        var obj = JSON.parse(ehr.content);
        console.log(obj);
        res.render("display", {issuer:ehr.issuer, ehrNumber:ehr.ehrNumber, content:obj, user:req.cookies.username, identity:req.cookies.identity});
        // var str = ehr.content;
        // console.log(str.toString());
        // var obj = JSON.parse(str.toString());
        // console.log(obj.age);
        // return res.send({
        //   status: 1,
        //   info: '查询成功' + `${ehr.issuer}'s ehr : ${ehr.ehrNumber} successfully issued ,issue time is ${ehr.issueDateTime}, content:${ehr.content}` 
        // });
    }
  }).catch(error =>{
      res.render("display", {issuer:"", ehrNumber:"", content:"", user:req.cookies.username, identity:req.cookies.identity});
      // return res.send({
      //   status: 0,
      //   info: 'error' + error
      // });
  });
  }
});

router.post('/_insert', function(req, res, next) {
  
  var issuer = req.body.issuer;
  var ehrNumber = req.body.ehrNumber;
  var issueDateTime = new Date().toString();
  var content = req.body.content;
  
 
  // 执行到这里说明用户名没有重复，可以将用户提交的数据插入数据库
  queryString = "insert into relation(issuer, pname, ehrid, issueDateTime) values('" + req.body.issuer + "', '" + req.body.content.pname +"','"+ req.body.ehrNumber + "','" + issueDateTime + "')";

  db.query(queryString, function(err, rows){
    if (err) {
      return res.send({
        status: 0,
        info: '添加失败'
      });
    }
  });

  var opt = new OPT();
  opt.insert(issuer, ehrNumber, issueDateTime, JSON.stringify(content)).then(function(result) {
    if (!result || result.length == 0) {
        console.log("添加失败");
        return res.send({
          status: 0,
          info: '添加失败=0'
        });
    } else {
        var ehr = Ehr.fromBuffer(result);
        console.log(`${ehr.issuer}'s ehr : ${ehr.ehrNumber} successfully issued ,issue time is ${ehr.issueDateTime}`);
        // var str = ehr.content;
        // console.log(str.toString());
        // var obj = JSON.parse(str.toString());
        // console.log(obj.age);
        return res.send({
          status: 1,
          info: '添加成功' + `${ehr.issuer}'s ehr : ${ehr.ehrNumber} successfully issued ,issue time is ${ehr.issueDateTime} + content:${ehr.content}`
        });
    }
  }).catch(error =>{
      console.log("fuck:" + error);
      return res.send({
        status: 0,
        info: 'error' + error
      });
  });

});

router.post('/_update', function(req, res, next) {
  
  var issuer = req.body.issuer;
  var ehrNumber = req.body.ehrNumber;
  // var issueDateTime = new Date().toLocaleString();
  var content = req.body.content;
  
  queryString = "update relation set pname='"+ req.body.content.pname + "' where issuer='" + req.body.issuer + "' AND ehrid='" + req.body.ehrNumber + "';";

  db.query(queryString, function(err, rows){
    if (err) {
      return res.send({
        status: 0,
        info: '修改失败'
      });
    }
  });

  var opt = new OPT();
  opt.update(issuer, ehrNumber, JSON.stringify(content)).then(function(result) {
    if (!result || result.length == 0) {
        console.log("修改失败");
        return res.send({
          status: 0,
          info: '修改失败=0'
        });
    } else {
        var ehr = Ehr.fromBuffer(result);
        console.log(`${ehr.issuer}'s ehr : ${ehr.ehrNumber} successfully issued ,issue time is ${ehr.issueDateTime}`);
        // var str = ehr.content;
        // console.log(str.toString());
        // var obj = JSON.parse(str.toString());
        // console.log(obj.age);
        return res.send({
          status: 1,
          info: '修改成功'
        });
    }
  }).catch(error =>{
      console.log("fuck:" + error);
      return res.send({
        status: 0,
        info: 'error' + error
      });
  });

});

router.get('/profile', function(req, res, next) {
  if (!req.cookies.username) {
    res.redirect("../login.html");
    console.log("未登录");
  } else {
    res.render('profile', {user: req.cookies.username, password:req.cookies.password, identity:req.cookies.identity});
  }
});
module.exports = router;

