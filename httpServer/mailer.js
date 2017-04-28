'use strict';
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({

});

exports.sendMain = function(receiver,content,Hyperlink,callback){
    var mailOptions = {
        from: 'stock_message@126.com'
        ,to: receiver
        ,subject: '密码重置'// Subject line
        ,html: '<b>您好！<br />请点击下面的链接进行密码重置</br>'+
        '<p> <a href="'+Hyperlink+'">'+content+'</a></p>'+
        '<p>若非本人操作，请忽略。</p>'
    };

    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error) {
            if(callback){
                callback(error);
            }
            console.log(error);
            return;
        }
        if(callback){
            callback(info.messageId, info.response);
        }
        // console.log('Message %s sent: %s', info.messageId, info.response);
    });
};

exports.getPWD = function(receiver,content,callback){
    var mailOptions = {
        from: 'stock_message@126.com'
        ,to: receiver
        ,subject: '密码获取'// Subject line
        ,html: '<b>您好！<br />您的密码是</br>'+
        '<p> '+content+'</p>'+
        '<p>若非本人操作，请忽略此邮件。</p>'
    };

    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error) {
            if(callback){
                callback("faise",error);
            }
            console.log(error);
            return;
        }
        if(callback){
            callback("success",info.messageId, info.response);
        }
        // console.log('Message %s sent: %s', info.messageId, info.response);
    });
};

// //test
this.sendMain('mazhou_654452588@qq.com','http://127.0.0.1:20080',function(){
    console.log(JSON.stringify(arguments));
});