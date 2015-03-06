module.exports.gui = function () {
  return {
    Window: {
      open: function (url) {
        window.open(url)
      }
    }
  }
}