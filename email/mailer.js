'use strict';
var fs = require('fs');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: "smtp.qq.com", // 主机
	secure: true,
	port:465,
	auth: {
	    user: "mazhou_654452588@qq.com", // 账号
	    pass: 'dpgkvikhzwlvbdic' // 密码
	}
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"mazhou 👻" <mazhou_654452588@qq.com>', // sender address
    to: 'mazhou@letv.com,mazhou_654452588@qq.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>'+
    '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>Embedded image: <img src="cid:unique@nodemailer.com"/>'
    +
    '<p>Here\'s a tou for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>'
    , // html body
    attachments: [
    	{   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        {
            filename: 'image.png',
            content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
            cid: 'note@example.com' // should be as unique as possible
        }
        ,
        {   // stream as an attachment
            filename: 'tou.jpg',
            content: fs.createReadStream(__dirname + '/tou.jpg'),
            cid: 'nyan@example.com' // should be as unique as possible
        }
    ]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
