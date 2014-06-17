var express = require('express');
var app = express();
var exec = require('child_process').exec,
    child;

app.post('/payload', function(req, res){
    res.send('mikey');
    gitPull();
});

var server = app.listen(4567, function() {
    console.log('Listening on port %d', server.address().port);
});

var startWeb = 'env $(cat /home/ubuntu/Museum/server/.env) forever start --uid "web" --append /home/ubuntu/Museum/server/web.js';
var startGif = 'env $(cat /home/ubuntu/Museum/server/.env) forever start --uid "gif" --append /home/ubuntu/Museum/server/gif.js';
var startNotifier = 'env $(cat /home/ubuntu/Museum/server/.env) forever start --uid "notifier" --append /home/ubuntu/Museum/server/notifier.js';
var stopWeb = 'forever stop web';
var stopGif = 'forever stop gif';
var stopNotifier = 'forever stop notifier';
var cont = false;

function gitPull() {

  var   command =  'cd /home/ubuntu/Museum/;';
        command += 'git pull origin master;';

    child = exec(command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            exec(stopWeb, handleStopGif);
        }
    });
  
    function handleStopGif(error, stdout, stderr) {
        console.log('stdout' + stdout)
        console.log('stderr' + stderr)

        if(stderr.search("Forever cannot find process with index:") > -1) {
            cont = true;
        }

        if(!error) {
            cont = true;
        }

        if(cont) {
            exec(stopGif, handleStopNotifier);
        }
    }
  
    function handleStopNotifier(error, stdout, stderr) {
        console.log('stdout' + stdout)
        console.log('stderr' + stderr)
        if(stderr.search("Forever cannot find process with index:") > -1) {
            cont = true;
        }

        if(!error) {
            cont = true;
        }

        if(cont) {
            exec(stopNotifier, handleStartWeb);
        }
    }
  
    function handleStartWeb(error, stdout, stderr) {
        console.log('stdout' + stdout)
        console.log('stderr' + stderr)
        if(stderr.search("Forever cannot find process with index:") > -1) {
            cont = true;
        }

        if(!error) {
            cont = true;
        }

        if(cont) {
            exec(startWeb, handleStartGif);
        }
    }
  
    function handleStartGif(error, stdout, stderr) {
        console.log('stdout' + stdout)
        console.log('stderr' + stderr)
        if(stderr.search("Forever cannot find process with index:") > -1) {
            cont = true;
        }

        if(!error) {
            cont = true;
        }

        if(cont) {
            exec(startGif, handleStartNotifier);
        }
    }
  
    function handleStartNotifier(error, stdout, stderr) {
        console.log('stdout' + stdout)
        console.log('stderr' + stderr)
        if(stderr.search("Forever cannot find process with index:") > -1) {
            cont = true;
        }

        if(!error) {
            cont = true;
        }

        if(cont) {
            exec(startNotifier, function(error, stdout, stderr) {
                console.log('stdout' + stdout)
                console.log('stderr' + stderr)
                console.log('worked');
            });
        }
    }
}

