var elasticsearch = require('elasticsearch');

function ReportESMD() {
	var self = this;
	self.client = new elasticsearch.Client({
		hosts : [ '10.127.92.39:9200', '10.127.92.40:9200', '10.127.92.41:9200' ]
	});

	// ==>>DEPRECATE======
	self.client.index({
		index : "mz_test_index",
		type : "mz_test_type",
		body : {aa:"aa",bb:"bb"}
	}, function(error, response) {
		console.log(error,response);
	});
}

exports.ReportESMD = ReportESMD;
