var minimist = require('minimist')
var nodemon = require('nodemon')
var path = require('path')
var fs = require('fs')
var debug = require('debug')('compose-watch')
var argv = minimist(process.argv.slice(2), {
  boolean: ['w', 'h', 'help']
})

console.log(argv)

if(argv.h || argv.help) {
  var help = [
    'Usage: compose-watch [-nw] appname [dir]',
    '',
    'Options:',
    ' -h, --help\tOutput help',
    ' -nw\tDo not watch, just restart the app once',
    ' dir\tDir to watch if it should be different than the appname'
  ]
  console.log(help.join('\n'))
  process.exit()
}

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
  var watchdir = app
  if(typeof argv._[1] !== 'undefined') {
    watchdir = argv._[1]
  }
  commands.push(' -w ' + dir + '/' + watchdir + '/')
}
debug('command', commands.join(''))
nodemon(commands.join(''))

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
