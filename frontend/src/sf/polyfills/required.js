require('console-polyfill'); // console in IE
require('./domRemove'); // node.remove() for IE11
require('date-polyfill'); // date.format()

[global.OffscreenCanvas, global.HTMLCanvasElement]
  .forEach((CanvasClass) => {
    if (!CanvasClass) return;

    // Canvas elements not garbage collected on iOS 12:
    // https://github.com/openlayers/openlayers/issues/9291
    // https://bugs.webkit.org/show_bug.cgi?id=195325
    const oldRemove = CanvasClass.prototype.remove;
    CanvasClass.prototype.remove = function (...args) {
      // NOTE: arrow function will break this
      this.width = 0;
      this.height = 0;
      return oldRemove.apply(this, args);
    };
  });
