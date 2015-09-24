var minimist = require('minimist')
var nodemon = require('nodemon')
var path = require('path')
var fs = require('fs')
var debug = require('debug')('compose-watch')
var argv = minimist(process.argv.slice(2), {
  boolean: 'w'
})

if(argv._.length !== 1) {
  var help = [
    'Usage: compose-watch [-nw] appname',
    '',
    'Options:',
    ' -nw\tDo not watch, just restart the app once'
  ]
  console.log(help.join('\n'))
}

if(argv._.length === 1) {
  var file = 'docker-compose.yml'
  var dir = findFile('docker-compose.yml', process.cwd())
  var app = argv._[0]
  var composeYamlFile = dir + '/' + file
  var commands = [
    '--exec "',
    'docker-compose -f ' + composeYamlFile + ' stop -t 0 ' + app + ' && ',
    'docker-compose -f ' + composeYamlFile + ' start ' + app + ' && ',
    'docker-compose -f ' + composeYamlFile + ' logs ' + app,
    '"'
  ]
  if(!argv.nw) {
    commands.push(' -w ' + dir + '/' + app + '/')
  }
  debug('command', commands.join(''))
  nodemon(commands.join(''))
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
    return path.resolve(dir)
  } catch (e) {
    return findFile(name, dir + '/..')
  }
}
