var argv = require('optimist').argv
var nodemon = require('nodemon')

if(argv._.length !== 1) {
  var help = ['Usage: compose-watch appname']
  console.log(help.join('\n'))
}

if(argv._.length === 1) {
  nodemon('--exec "docker-compose stop -t 0 ' + argv._ + ' && docker-compose start ' + argv._ + ' && docker-compose logs ' + argv._ + '" -w ' + argv._ + '/')  
}
