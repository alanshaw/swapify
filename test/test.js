var fs = require('fs')
var test = require('tape')
var concat = require('concat-stream')
var nwmock = require('../')

test('Replaces nw.gui with mock', function (t) {
  t.plan(2)

  var opts = {mock: {gui: function () { /* TEST */ }}}

  fs.createReadStream(__dirname + '/fixtures/gui.js')
    .pipe(nwmock('gui.js', opts))
    .pipe(concat(function (data) {
      data = data.toString()
      t.ok(data.indexOf('nw.gui') == -1, 'nw.gui was replaced')
      t.ok(data.indexOf(opts.mock.gui.toString()) > -1, 'nw.gui was replaced with mock gui')
      t.end()
    }))
})
