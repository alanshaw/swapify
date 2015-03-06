var through = require('through2')
var falafel = require('falafel')

module.exports = function (file, opts) {
  if (/\.json$/.test(file)) return through()

  opts = opts || {}
  opts.swaps = opts.swaps || {}

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

function parse (data, opts) {
  var swapRegexs = Object.keys(opts.swaps).map(function (r) {
    return new RegExp(r)
  })

  return falafel(data, function (node) {

    if (node.type == 'Literal' &&
        node.parent &&
        node.parent.type == 'CallExpression' &&
        node.parent.callee &&
        node.parent.callee.type == 'Identifier' &&
        node.parent.callee.name == 'require') {

      var swapRegex = null

      for (var i = 0; i < swapRegexs.length; i++) {
        if (swapRegexs[i].test(node.value)) {
          swapRegex = swapRegexs[i]
          break
        }
      }

      if (swapRegex) {
        node.update('"' + opts.swaps[swapRegex.source] + '"')
      }
    }
  })
}