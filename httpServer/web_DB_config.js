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
                console.log('Connection %d acquired', connection.threadId);

            });

            this.pool.on('connection', function (connection) {
                connection.query('SET SESSION auto_increment_increment=1')
            });

            this.pool.on('enqueue', function () {
                console.log('Waiting for available connection slot');
            });

            this.pool.on('release', function (connection) {
                console.log('Connection %d released', connection.threadId);
            });
        }
    }

    this.mysql_pool_getConnection();

    this.query = function(sql,callback){
        this.pool.getConnection(function(err, connection){
            // connected! (unless `err` is set) 
            if(!err){
                connection.query()
                var query =  connection.query(sql);
                query
                .on('error', function(err) {
                    // Handle error, an 'end' event will be emitted after this as well 
                    callback('error',err);
                     console.log("error");
                })
                .on('fields', function(fields) {
                    // the field packets for the rows to follow 
                    console.log("fields>>"+fields);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O 
                    // mycon.pause();
                    // processRow(row, function() {
                    //   mycon.resume();
                    // });
                    
                    if(callback){
                        callback(row)
                    }
                    console.log("result");
                })
                .on('end', function() {
                // all rows have been received 
                    query = null;   
                    callback = null;
                    connection.release();
                    console.log("end");
                });
            }
        });
    }
    this.query(
        "SELECT  `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER` FROM tb_user_basic", 
        function (){
            console.log("arguments.length:"+arguments.length);
            console.log("JSON.stringify(arguments):"+JSON.stringify(arguments));
        }
    );
    // mycon.query("SELECT  `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER` FROM tb_user_basic", function (error, results, fields) {
};
module.exports = new web_DB_config();