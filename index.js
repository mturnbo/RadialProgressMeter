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
      width: options.width || 400,
      height: options.height || 400,
      centerX: options.centerX || 150,
      centerY: options.centerY || 150,
      radius: options.radius || 100,
      stroke: options.stroke || 25,
      animation: {
        duration: options.animation && options.animation.duration || 1750,
        delay: options.animation && options.animation.delay || 200
      },
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

  // create svg element
  this.svg = document.createElementNS(svgns, 'svg');
  this.svg.setAttribute('width', this.options.width);
  this.svg.setAttribute('height', this.options.height);

  // gradient
  var grad = document.createElementNS(svgns, 'linearGradient');
  grad.setAttribute('id', 'gradProgress');

  var startStop = document.createElementNS(svgns, 'stop');
  startStop.setAttribute('offset', '0%');
  startStop.setAttribute('stop-color', this.options.colors.meterStart);
  grad.appendChild(startStop);

  var endStop = document.createElementNS(svgns, 'stop');
  endStop.setAttribute('offset', '100%');
  endStop.setAttribute('stop-color', this.options.colors.meterStop);
  grad.appendChild(endStop);

  var defs = document.createElementNS(svgns,'defs')
  defs.appendChild(grad);

  this.svg.insertBefore(defs, this.svg.firstChild);

  // background arc
  this.meterBackground = document.createElementNS(this.svg.namespaceURI, 'path');
  this.meterBackground.setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      self.options.endAngle
  ));
  this.meterBackground.style.fill = 'none';
  this.meterBackground.style.stroke = this.options.colors.background;
  this.meterBackground.style.strokeWidth = this.options.stroke;
  this.meterBackground.style.strokeLinecap = 'round';

  this.svg.appendChild(this.meterBackground);

  // progress arc
  var progressAngle = self.options.progress * (self.options.endAngle - self.options.startAngle) + self.options.startAngle;
  this.meterProgress = document.createElementNS(this.svg.namespaceURI, 'path');
  this.meterProgress.setAttribute("d", arcAttributes(
      self.options.centerX,
      self.options.centerY,
      self.options.radius,
      self.options.startAngle,
      progressAngle
  ));
  this.meterProgress.style.fill = 'none';
  this.meterProgress.style.stroke = 'url(#gradProgress)';
  this.meterProgress.style.strokeWidth = this.options.stroke;
  this.meterProgress.style.strokeLinecap = 'round';

  this.svg.appendChild(this.meterProgress);

  document.getElementById(element).appendChild(this.svg);

}

if (typeof module !== 'undefined') module.exports = RadialProgressMeter;
