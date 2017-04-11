const util = require('util');
const mysql = require('mysql');
const path = require('path');
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
        console.log(path.basename(__filename),"connection");
        this.connection = mysql.createConnection(this.dbcfg);
        this.connection.connect();


        // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        //     if (error) throw error;
        //     console.log('The solution is: ', results[0].solution);
        // });
        // return this.connection;
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
                // console.log(path.basename(__filename),'Connection %d acquired', connection.threadId);
            });

            this.pool.on('connection', function (connection) {
                connection.query('SET SESSION auto_increment_increment=1')
                // console.log(path.basename(__filename),'connection');
            });

            this.pool.on('enqueue', function () {
                // console.log(path.basename(__filename),'Waiting for available connection slot');
            });

            this.pool.on('release', function (connection) {
                // console.log(path.basename(__filename),'Connection %d released', connection.threadId);
            });
        }
    }

    
    this.mysql_pool_getConnection();

    this.query = function(sql,callback){
        console.log(path.basename(__filename),"query-sql",sql);
        var rows = []
        this.pool.getConnection(function(err, connection){
            // connected! (unless `err` is set) 
            if(!err){
                // connection.query()
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
                        console.log(path.basename(__filename),'query-end',rows)
                        if(callback){
                            callback(rows);
                            callback = null;
                        }
                    }
                    
                    query = null;
                    connection.release();

                });
            }else{
                if(callback){
                    callback('error2',err);
                    callback = null;
                }
            }
        });
    }

    this.transaction = function(sql1, sql2, callback){
        var self = this;
        if(!self.connection){
            self.mysql_connection();
        }
        
        self.connection.beginTransaction(function(err) {
            if (err) { throw err; }
            // self.connection.query('INSERT INTO posts SET title=?', title, function (error, results, fields) {
                console.log(path.basename(__filename),'transaction-sql1',sql1);
                self.connection.query(sql1, function (error, results, fields) {
                if (error) {
                    return self.connection.rollback(function() {
                        throw error;
                    });
                }

                // results.insertId;
                // self.connection.query('INSERT INTO log SET data=?', log, function (error, results, fields) {
                console.log(path.basename(__filename),'transaction-sql2',sql2);
                self.connection.query(sql2, function (error, results, fields) {

                    if (error) {
                        return self.connection.rollback(function() {
                            throw error;
                        });
                    }
                    console.log(path.basename(__filename),'transaction',JSON.stringify(results));
                    self.connection.commit(function(err) {
                        if (err) {
                            return self.connection.rollback(function() {
                                throw err;
                            });
                        }
                        console.log(path.basename(__filename),'transaction','success!');
                        callback('success');
                    });
                });
            });
        });
    }


};
module.exports = new web_DB_config();