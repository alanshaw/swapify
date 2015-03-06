var fs = require('fs')
var test = require('tape')
var concat = require('concat-stream')
var nwmock = require('../')

test('Replaces nw.gui with mock', function (t) {
  t.plan(2)

  var opts = {swaps: {'nw\\.gui': 'foobar'}}

  fs.createReadStream(__dirname + '/fixtures/gui.js')
    .pipe(nwmock('gui.js', opts))
    .pipe(concat(function (data) {
      data = data.toString()
      console.log(data)
      t.ok(data.indexOf('nw.gui') == -1, 'nw.gui was replaced')
      t.ok(data.indexOf('foobar') > -1, 'nw.gui was replaced with foobar')
      t.end()
    }))
})
