#!/usr/bin/env node

var exec = require('child_process').exec;
var fs = require('fs');
var async = require('async');
var Mustache = require('mustache');
var express = require('express');
var app = express();
var argv = require('./lib/args-handler.js');

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

var SERVER_PORT = argv.port.trim();
var TEMPLATE_DIR = __dirname+'/templates/';
var HOME_TEMPLATE = "home.mustache";

if (isNaN(SERVER_PORT)) throw Error('SERVER_PORT not a number');

app.get('/', function (req, res) {
	fs.readFile(TEMPLATE_DIR+HOME_TEMPLATE, function (err, template) {
	  if (err) throw err;

	 
		async.series({
		    date: function(callback){
				execute('date', function(data){
					callback(null, data);
				});
		    },
		    cpu: function(callback){
				execute('mpstat', function(data){
					if (data)
						callback(null, data);
					else
						callback(null, 'Make sure to have sysstat installed for mpstat command');
				});
		    },
		    ram: function(callback){
				execute('free -h', function(data){
					callback(null, data);
				});
		    },
		    uptime: function(callback){
				execute('uptime', function(data){
					callback(null, data);
				});
		    },
		    partitions: function(callback){
				execute('df -h', function(data){
					callback(null, data);
				});
		    },
		    temperature: function(callback){
				execute('/opt/vc/bin/vcgencmd measure_temp', function(data){
					callback(null, data);
				});
		    },
		    last_ssh: function(callback){
				execute('last -n 5', function(data){
					callback(null, data);
				});
		    },
		    usb: function(callback){
				execute('lsusb', function(data){
					callback(null, data);
				});
		    },
		    network: function(callback){
				execute('/sbin/ifconfig', function(data){
					callback(null, data);
				});
		    },
		    wifi: function(callback){
		    	execute('iwlist wlan0 scan | grep ESSID', function(data){
		    		callback(null, data.toString().trim());
		    	});
		    }
		},
		function(err, obj_to_render) {
		   
		    if (err) res.send(err);
		    var output = Mustache.render(template.toString(), obj_to_render);
	  		res.send(output); 
		});

	});
  	
});


var server = app.listen(SERVER_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Dashboard listening at http://%s:%s', host, port);
});
