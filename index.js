function RadialProgressMeter(element, options) {

  var self = this;
  var svgns = "http://www.w3.org/2000/svg"
  var xns = "http://www.w3.org/2000/xlink/namespace/";

  self.options = validateOptions(options);

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  function arcAttributes(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, startAngle);
    var end = polarToCartesian(x, y, radius, endAngle);
    var isLargeArc = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, isLargeArc, 1, end.x, end.y
    ].join(" ");
  }

  function validateOptions(options) {

    if (!options || typeof options !== 'object') {
      options = {};
    }

    return {
      width: options.width || 300,
      height: options.height || 300,
      centerX: options.centerX || 150,
      centerY: options.centerY || 150,
      radius: options.radius || 100,
      stroke: options.stroke || 25,
      startAngle: options.startAngle || -120,
      endAngle: options.endAngle || 120,
      progress: options.progress || 0,
      colors: {
        background: options.colors && options.colors.background || '#CECECE',
        meterStart: options.colors && options.colors.meterStart || '#2DA4D8',
        meterStop: options.colors && options.colors.meterStop || '#8CDAF9'
      }
    };
  }

  function makeGradient(id, colorStart, colorEnd) {
    var grad = document.createElementNS(svgns, 'linearGradient');
    grad.setAttribute('id', id);

    var startStop = document.createElementNS(svgns, 'stop');
    startStop.setAttribute('offset', '0%');
    startStop.setAttribute('stop-color', colorStart);
    grad.appendChild(startStop);

    var endStop = document.createElementNS(svgns, 'stop');
    endStop.setAttribute('offset', '100%');
    endStop.setAttribute('stop-color', colorEnd);
    grad.appendChild(endStop);

    return grad;
  }

  // create svg element
  self.svg = document.createElementNS(svgns, 'svg');
  self.svg.setAttribute('width', self.options.width);
  self.svg.setAttribute('height', self.options.height);

  // gradient
  var grad = makeGradient('gradProgress', self.options.colors.meterStart,  self.options.colors.meterStop);

  var defs = document.createElementNS(svgns,'defs')
  defs.appendChild(grad);

  self.svg.insertBefore(defs, self.svg.firstChild);

  // background arc
  var meterBackground = document.createElementNS(svgns, 'path');
  meterBackground.setAttribute('id', 'meterBackground');
  meterBackground.setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      self.options.endAngle
  ));
  meterBackground.style.fill = 'none';
  meterBackground.style.stroke = self.options.colors.background;
  meterBackground.style.strokeWidth = self.options.stroke;
  meterBackground.style.strokeLinecap = 'round';

  self.svg.appendChild(meterBackground);

  // progress arc
  var progressAngle = self.options.progress * (self.options.endAngle - self.options.startAngle) + self.options.startAngle;
  var meterProgress = document.createElementNS(svgns, 'path');
  meterProgress.setAttribute('id', 'meterProgress');
  meterProgress.setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      progressAngle
  ));
  meterProgress.style.fill = 'none';
  meterProgress.style.stroke = 'url(#gradProgress)';
  meterProgress.style.strokeWidth = self.options.stroke;
  meterProgress.style.strokeLinecap = 'round';
  meterProgress.style.strokeDasharray = '';
  meterProgress.style.strokeDashoffset = '0.00';

  self.svg.appendChild(meterProgress);
}


RadialProgressMeter.prototype.animate = function (duration, delay) {
  var self = this;

  var meter = self.svg.lastChild;
  var length = meter.getTotalLength();

  meter.style.transition = meter.style.WebkitTransition = 'none';
  meter.style.strokeDasharray = length + ' ' + length;
  meter.style.strokeDashoffset = length;

  meter.getBoundingClientRect();

  meter.style.transition = meter.style.WedkitTransition = 'stroke-dashoffset '
      + duration + 'ms ease-out';
  meter.style.transitionDelay = delay || 0 + 'ms';
  meter.style.strokeDashoffset = '0';
}

if (typeof module !== 'undefined') module.exports = RadialProgressMeter;
