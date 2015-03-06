var through = require('through2')
var falafel = require('falafel')
var xtend = require('xtend')
var mock = require('./mock')

module.exports = function (file, opts) {
  if (/\.json$/.test(file)) return through()

  opts = opts || {}
  opts.mock = xtend(mock, opts.mock)

  var data = ""

  return through(
    function (buf, enc, cb) {
      data += buf
      cb()
    },
    function (cb) {
      try {
        this.push(String(parse(data, opts)))
      } catch (er) {
        return cb(new Error(er.toString().replace('Error: ', '') + ' (' + file + ')'))
      }
      cb()
    }
  )
}

var nwRegex = /^nw/

function parse (data, opts) {
  return falafel(data, function (node) {

    if (node.type == 'Literal' &&
        nwRegex.test(node.value) &&
        node.parent &&
        node.parent.type == 'CallExpression' &&
        node.parent.callee &&
        node.parent.callee.type == 'Identifier' &&
        node.parent.callee.name == 'require') {

      var lib = node.value.replace('nw.', '')

      if (opts.mock[lib]) {
        node.parent.update('(' + opts.mock[lib].toString() + ')()')
      }
    }
  })
}