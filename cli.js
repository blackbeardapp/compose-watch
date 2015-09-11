var argv = require('optimist').argv
var nodemon = require('nodemon')
var path = require('path')
var fs = require('fs')
var debug = require('debug')('compose-watch')

if(argv._.length !== 1) {
  var help = ['Usage: compose-watch appname']
  console.log(help.join('\n'))
}

if(argv._.length === 1) {
  var dockerComposeYaml = findFile('docker-compose.yml', process.cwd())
  var app = argv._[0]
  var command = [
    '--exec "',
    'docker-compose -f ' + dockerComposeYaml + ' stop -t 0 ' + app + ' && ',
    'docker-compose -f ' + dockerComposeYaml + ' start ' + app + ' && ',
    'docker-compose -f ' + dockerComposeYaml + ' logs ' + app + '"',
    ' -w ' + app + '/'
  ].join('')
  debug('command', command)
  nodemon(command)
}

var prev = ''

function findFile(name, dir) {
  var filepath = path.resolve(dir, name)

  // we hit root /
  if(prev === filepath) {
    return false
  }
  prev = filepath

  debug('checking', filepath)
  try {
    fs.statSync(filepath)
    return filepath
  } catch (e) {
    return findFile(name, dir + '/..')
  }
}
