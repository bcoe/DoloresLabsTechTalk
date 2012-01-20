var puts = require('sys').puts,
	express = require('express'),
	nodemailer = require('nodemailer'),
	url = require('url'),
	http = require('http');
	
function downloadImage(imageUrl, callback) {
	var client = http.createClient(80, url.parse(imageUrl).hostname);
	var request = client.request('GET', imageUrl, {"host": url.parse(imageUrl).hostname});
	request.end();

	request.addListener('response', function (response) {
	    response.setEncoding('binary')
	    var body = '';
	
	    response.addListener('data', function (chunk) {
	        body += chunk;
	    });
	
	    response.addListener("end", function() {
			callback(body);
		});
	});
}

nodemailer.SMTP = {
	host: 'smtp.gmail.com', // required
	use_authentication: true, // optional, false by default
	user: process.env.GMAIL_ACCOUNT, // used only when use_authentication is true 
	pass: process.env.GMAIL_PASSWORD  // used only when use_authentication is true*/
};

function sendMail(imageData, filename, email, callback) {
	
	var attachmentList = [{
		filename: filename,
		contents: new Buffer(imageData, 'binary')
	}];
		
	var mailData = {
		sender: process.env.GMAIL_ACCOUNT,
		to: email,
		subject: "Here is an image for you: " + filename,
		body: "Here's that image you asked for.",
		attachments: attachmentList
	}
		
	nodemailer.send_mail(mailData, function(err, success) {
		callback(err, success);
	});
}

var app = express.createServer();

app.get('/', function(req, res){
	var imageUrl = req.param('imageUrl'),
		filename = ( imageUrl.match(/^.*\/([^/]*)$/)[1] ).match(/([^?&]*)/)[1];
	
	downloadImage(imageUrl, function(imageData) {
		sendMail(imageData, filename, req.param('email'), function(err, success) {
			res.contentType('application/json');
			if (err) {
				res.send({
					success: false
				});		
			} else {
				res.send({
					success: true
				});
			}
		});
	});
});

app.on('error', function(err) {
	puts(err);
});

app.listen(80);