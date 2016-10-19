var d3;

function RadialProgressMeter(query, options) {

  // load D3
  d3 = (typeof window !== 'undefined' && window.d3) ? window.d3 : typeof require !== 'undefined' ? require('d3') : undefined;
  if (!d3) throw new Error('d3 object is missing. D3.js library has to be loaded before.');

  var self = this;
  self.options = options;

}

if (typeof module !== 'undefined') module.exports = RadialProgressMeter;
