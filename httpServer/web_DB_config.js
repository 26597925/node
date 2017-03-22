var util = require('util');
var mysql = require('mysql');

var web_DB_config = function()
{
    //"115.182.51.49","root","OGNkNGUyZmM3ZWE","winners",3306

   
	this.databasesName = "winners";
    this.selectTB = false;
    this.connection = null;
    this.pool = null;
    
    
    this.dbcfg =
    {
        connectionLimit:                20,
        host:                           "127.0.0.1",//"115.182.51.49",
        port:                           8889,//3307,
        user:                           "root",
        password:                       "root",//"OGNkNGUyZmM3ZWE",
        database:                       this.databasesName,
        insecureAuth:                   true,
        connectTimeout:                 2*60*1000
    };
    //========================================>
    this.mysql_connection = function(){
        this.connection = mysql.createConnection(this.dbcfg);
        this.connection.connect();
        // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        //     if (error) throw error;
        //     console.log('The solution is: ', results[0].solution);
        // });
        return this.connection;
    }

    this.mysql_end =function(){
        if(this.connection){
            this.connection.end(function(err) {
              // The connection is terminated now 
            });
            // connection.destroy();
        }
    }

    //========================================>
    this.mysql_pool_getConnection = function(callback){
        if(!this.pool){

            this.dbcfg['connectionLimit'] = 13;

            this.pool  = mysql.createPool(this.dbcfg);

            this.pool.on('acquire', function (connection) {
                // console.log('Connection %d acquired', connection.threadId);
            });

            this.pool.on('connection', function (connection) {
                connection.query('SET SESSION auto_increment_increment=1')
                // console.log('connection');
            });

            this.pool.on('enqueue', function () {
                // console.log('Waiting for available connection slot');
            });

            this.pool.on('release', function (connection) {
                // console.log('Connection %d released', connection.threadId);
            });
        }
    }

    this.mysql_pool_getConnection();

    this.query = function(sql,callback){
        console.log("sql",sql);
        var rows = []
        this.pool.getConnection(function(err, connection){
            // connected! (unless `err` is set) 
            if(!err){
                connection.query()
                var query =  connection.query(sql);
                query
                .on('error', function(err) {
                    // Handle error, an 'end' event will be emitted after this as well 
                    if(callback){
                        callback('error',err);
                        // callback = null;
                    }
                    
                    console.log("error");
                })
                .on('fields', function(fields) {
                    // the field packets for the rows to follow 
                    // console.log("fields>>"+JSON.stringify(fields));
                    /**
                    [
                    {"catalog":"def"
                    ,"db":"winners"
                    ,"table":"tb_user_basic"
                    ,"orgTable":"tb_user_basic"
                    ,"name":"USERID"
                    ,"orgName":"USERID"
                    ,"charsetNr":63
                    ,"length":11
                    ,"type":3
                    ,"flags":16419
                    ,"decimals":0
                    ,"zeroFill":false
                    ,"protocol41":true}

                    ,{"catalog":"def"
                    ,"db":"winners"
                    ,"table":"tb_user_basic"
                    ,"orgTable":"tb_user_basic"
                    ,"name":"GROUPID"
                    ,"orgName":"GROUPID"
                    ,"charsetNr":63
                    ,"length":11
                    ,"type":3
                    ,"flags":0
                    ,"decimals":0
                    ,"zeroFill":false
                    ,"protocol41":true}.....]
                    */
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O 
                    // mycon.pause();
                    // processRow(row, function() {
                    //   mycon.resume();
                    // });
                    
                    rows.push(row);
                    
                })
                .on('end', function() {
                // all rows have been received
                    console.log("mysql end ->result",rows);
                    if(rows.length == 0){
                        if(callback){
                            callback();
                            callback = null;
                        }
                    }else{
                        console.log("callback")
                        if(callback){
                            callback(rows);
                            callback = null;
                        }
                    }
                    
                    query = null;
                    connection.release();
                    // console.log("end");
                });
            }else{
                if(callback){
                    callback('error2',err);
                    callback = null;
                }
            }
        });
    }

    // this.query(
    //     "SELECT * FROM tb_user_account", 
    //     function (){
    //         console.log("arguments.length:"+arguments.length);
    //         console.log("JSON.stringify(arguments):"+JSON.stringify(arguments));
    //     }
    // );
    // this.query(
    //     "SELECT  `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER` FROM tb_user_basic", 
    //     function (){
    //         console.log("arguments.length:"+arguments.length);
    //         console.log("JSON.stringify(arguments):"+JSON.stringify(arguments));
    //     }
    // );
};
module.exports = new web_DB_config();