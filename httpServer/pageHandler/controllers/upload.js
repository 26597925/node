const formidable = require('formidable');
const http = require('http');
const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.upload = function(){
    var self = this;
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'message':'登录成功'};
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.uploadDir = path.join(__dirname, '..','/uploads','/',uID);

    if (!fs.existsSync(form.uploadDir)){
        fs.mkdirSync(form.uploadDir);
    }

    var stocks = [];
    form.on('file', function(field, file) {
        // console.log("path:",file.path);

        fs.readFile(file.path, 'utf8', function (err,data) {
            if (err) {
                result.success = false;
                result.message = "upload code 1 read file error!";
                self.responseDirect(200,"text/json",JSON.stringify(result));
                return console.log(err);
            }

            var lines = data.split("\n");
            var stock = "";
            var start = false;
            var letter = 0;

            for(var i = 0; i < lines.length; i++){
                for(var j = 0; j < lines[i].length; j++){
                    if(j == 0){stock = '';}
                    letter = parseInt(lines[i][j]);
                    // console.log(letter);
                    if( !isNaN(letter) ){
                        stock += letter;
                    }else{
                        if(stock.length>0){
                            stocks.push(stock);
                            stock = '';
                        }
                        break;
                    }

                }
            }

            result.data = stocks;
            self.responseDirect(200,"text/json",JSON.stringify(result));
            fs.unlinkSync(file.path);
        });
        // fs.rename(file.path, path.join(form.uploadDir, unit_date.Format(new Date(),"yy_MM_dd_HH_mm_ss_SSS")+file.name));
    });

    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        result.message = "upload code 2 upload file  error!";
        self.responseDirect(200,"text/json",JSON.stringify(result));
    });

    form.on('end', function() {
        //res.end('success');
    });

    form.parse(self.req);

    // form.parse(self.req, function(err, fields, files) {
    //
    //     // res.writeHead(200, {'content-type': 'text/plain'});
    //     // res.write('received upload:\n\n');
    //     // res.end(util.inspect({fields: fields, files: JSON.stringify(files)}));
    //
    // });
};
