function RadialProgressMeter(backgroundElement, progressElement, options) {

  var self = this;
  self.options = options;

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  function arcAttributes(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var isLargeArc = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, isLargeArc, 0, end.x, end.y
    ].join(" ");
  }

  function validateOptions(options) {

    if (!options || typeof options !== 'object') {
      options = {};
    }

    return {
      radius: options.radius || 100,
      stroke: {
        width: options.stroke && options.stroke.width || 40,
        gap: options.stroke && options.stroke.gap || 2
      },
      animation: {
        duration: options.animation && options.animation.duration || 1750,
        delay: options.animation && options.animation.delay || 200
      },
      startAngle: options.startAngle || -120,
      endAngle: options.endAngle || 120,
      progress: options.progress || 0
    };
  }

  // set background
  document.getElementById(backgroundElement).setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      self.options.endAngle
  ));

  // set progress
  document.getElementById(progressElement).setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      90
  ));

}

if (typeof module !== 'undefined') module.exports = RadialProgressMeter;
