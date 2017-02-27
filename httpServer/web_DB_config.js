var web_DB_config = function()
{
    //"115.182.51.49","root","OGNkNGUyZmM3ZWE","winners",3306
    this.dbcfg =
    {
        connectionLimit:                20,
        host:                           "115.182.51.49",
        port:                           3307,
        user:                           "root",
        password:                       "OGNkNGUyZmM3ZWE",
        insecureAuth:                   true,
        connectTimeout:                 2*60*1000
    };
   
	this.databasesName = "winners";
	
};
module.exports = new web_DB_config();
