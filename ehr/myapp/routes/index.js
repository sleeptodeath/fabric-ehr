var express = require('express');
var router = express.Router();
var db = require('../config.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.cookies.username) {
    res.render('login');
  } else {
    res.redirect('/user.html');
  }
});

router.get('/user.html', function(req, res, next) {
  if (!req.cookies.username) {
    res.render('login');
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

router.get('/register.html', function(req,res,next) {
  res.render('register');
});

router.post('/register', function(req,res,next) {
  var username = req.body.username;
  var password = req.body.password;
  var identity = req.body.identity;
  console.log("identity:" + identity);
  if (!username || username.length==0 || !password || password.length==0) {
    return res.send({
      status: 0,
      info: '账号密码不能为空'
    });
  } 
   // 执行到这里说明用户名没有重复，可以将用户提交的数据插入数据库
   queryString = "insert into user(username, password, identity) values('" + req.body.username + "', '" + req.body.password + "', '" + req.body.identity + "');";

   db.query(queryString, function(err, rows){
     if (err) {
      return res.send({
        status: 0,
        info: "用户已存在"
      });
     }else {
       console.log("rows.length:"+rows.length);
      return res.send({
        status: 1,
        info: '注册成功'
      });
     }
   })
});

router.get('/login.html', function(req, res, next) {
  res.render('login');
});

router.get('/logout.html', function(req, res, next) {
  res.clearCookie('username');
  res.clearCookie('password');
  res.clearCookie('identity');
  res.redirect("login.html");
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || username.length==0 || !password || password.length==0) {
    return res.send({
      status: 0,
      info: '账号密码不能为空'
    });
  } 

  var queryString = "select * from user where username='" + req.body.username  + "';";
  db.query(queryString, function(err, row){
    if (err) {
      return res.send({
        status: 0,
        info: err.message
      });
    }else {
      if (row.length == 0) {
        return res.send({
          status: 0,
          info: '账号不存在'
        });
      }  else {
	if (row[0].password == password) {
	
        res.cookie('username',username);
        res.cookie('password',password);
        res.cookie('identity', row[0].identity);

        return res.send({
            status: 1,
            info: '登入成功'
        });
	} else {

        return res.send({
          status: 0,
          info: '密码错误'
        });
	}
      }
    }
  });
});
module.exports = router;

