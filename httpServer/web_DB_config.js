var util = require('util');
var mysql = require('mysql');

var web_DB_config = function()
{
    //"115.182.51.49","root","OGNkNGUyZmM3ZWE","winners",3306
    this.dbcfg =
    {
        connectionLimit:                20,
        host:                           "127.0.0.1",//"115.182.51.49",
        port:                           8889,//3307,
        user:                           "root",
        password:                       "root",//"OGNkNGUyZmM3ZWE",
        insecureAuth:                   true,
        connectTimeout:                 2*60*1000
    };
   
	this.databasesName = "winners";
    
    this.connection = null;
    this.pool = null;

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

        this.pool.getConnection(function(err, connection) {
          // connected! (unless `err` is set) 
            if(!err){
                // connection.release();
                callback(connection);
            }
        });
    }
    this.callback=function(mycon){
        mycon.query('use winners', function (error, results, fields) {
            // And done with the connection.
            console.log("<<<<<<",error,results,fields);
//
            var query = mycon.query('SELECT * FROM tb_user_basic');
            query
              .on('error', function(err) {
                // Handle error, an 'end' event will be emitted after this as well 
              })
              .on('fields', function(fields) {
                // the field packets for the rows to follow 
              })
              .on('result', function(row) {
                console.log(">>>",row)
                // Pausing the connnection is useful if your processing involves I/O 
                // mycon.pause();
             
                // processRow(row, function() {
                //   mycon.resume();
                // });
              })
              .on('end', function() {
                // all rows have been received 
                // mycon.release();
              });

//
            // mycon.query("SELECT  `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER` FROM tb_user_basic", function (error, results, fields) {
            //     console.log(results.length);

            //     console.log(">>>>",error,results,fields);
            //     mycon.release();
            // });
           
            // Handle error after the release. 
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool. 
        });
    }
    var mycon = this.mysql_pool_getConnection(this.callback);
};
module.exports = new web_DB_config();