// Constants
var TWO_PI = Math.PI * 2;
var ABC_A = 1;
var ABC_B = 3;
var POINTS = 120;
var LISSAJOUS_COLOR = '#1C1C1C';
var ANTS_COLOR = '#363636';

// Constants (tweakable)
var WIDTH = 400;
var HEIGHT = Math.round(WIDTH * .7);
var THICKNESS = Math.round(WIDTH / 6.5);
var QUANTIZATION = 0.95;
var ANT_THICKNESS = Math.round(THICKNESS / 3);
var MASK_THICKNESS = Math.round(THICKNESS * 1.25);

var X_SCALE = d3.scaleLinear()
    .domain([-1, -0.75, -0.15, 0.15, 0.75, 1])
    .range([THICKNESS / 2, WIDTH / 4, (WIDTH - THICKNESS) / 2, (WIDTH + THICKNESS) / 2, WIDTH / 4 * 3, WIDTH - THICKNESS / 2]);

var pathFn = d3.line()
  .x(function (d) {
    var quantized = Math.max(Math.min(d.x, QUANTIZATION), -QUANTIZATION);
    return Math.round(X_SCALE(quantized));
  })
  .y(function (d) {
    return Math.round((HEIGHT - THICKNESS) / 2 * d.y + HEIGHT / 2);
  });

var lissajous = [];
for (var i = 0, len = POINTS; i <= len; i++) {
  lissajous.push({
    x: Math.cos(ABC_A * TWO_PI * i / len),
    y: Math.sin(ABC_B * TWO_PI * i / len)
  });
}

var maskSegmentA = lissajous.slice(13, 27);
var maskSegmentA2 = lissajous.slice(0, 28);
var maskSegmentB = lissajous.slice(73, 87);
var maskSegmentB2 = lissajous.slice(60, 88);
var antsASegment = lissajous.slice(102).concat(lissajous.slice(0, 39));
var antsBSegment = lissajous.slice(42, 99);

var svg = d3.select('body').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT);

var lissajousPath = svg.append('path')
  .attr('class', 'lissajous')
  .attr('mask', 'url(#mask-lissajous)')
  .attr('d', pathFn(lissajous));

var DASHOFFSET = lissajousPath.node().getTotalLength();
var GAP_LENGTH = DASHOFFSET / 32;
var DASH_LENGTH = DASHOFFSET / 8 - GAP_LENGTH;
var DASHARRAY = [Math.round(DASH_LENGTH), Math.round(GAP_LENGTH)].join();

var antsAPath = svg.append('path')
  .attr('class', 'ants')
  .attr('mask', 'url(#mask-ants)')
  .attr('d', pathFn(antsASegment));

var antsBPath = svg.append('path')
  .attr('class', 'ants')
  .attr('mask', 'url(#mask-ants)')
  .attr('d', pathFn(antsBSegment));

var defs = svg.append('defs');

defs.append('style').text(`
  @keyframes ants {
    100% {
      stroke-dashoffset: 0;
    }
  }
  .lissajous {
    stroke: ${LISSAJOUS_COLOR};
    stroke-width: ${THICKNESS};
    stroke-linejoin: round;
    fill: none;
  }
  .ants {
    stroke: ${ANTS_COLOR};
    stroke-width: ${ANT_THICKNESS};
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: ${DASHARRAY};
    stroke-dashoffset: ${Math.round(DASHOFFSET)};
    fill: none;
    animation: ants 10s linear infinite;
  }
`);

var maskLissajous = defs.append('mask')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .attr('maskUnits', 'userSpaceOnUse')
  .attr('id', 'mask-lissajous');

maskLissajous.append('rect')
  .attr('fill', '#fff')
  .attr('stroke', 'none')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

maskLissajous.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentA));

maskLissajous.append('path')
  .attr('stroke', '#fff')
  .attr('stroke-width', THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentA2));

maskLissajous.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentB));

maskLissajous.append('path')
  .attr('stroke', '#fff')
  .attr('stroke-width', THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentB2));

var maskAnts = defs.append('mask')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .attr('maskUnits', 'userSpaceOnUse')
  .attr('id', 'mask-ants');

maskAnts.append('rect')
  .attr('fill', '#fff')
  .attr('stroke', 'none')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

maskAnts.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentA));

maskAnts.append('path')
  .attr('stroke', '#fff')
  .attr('stroke-width', ANT_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentA2));

maskAnts.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentB));

maskAnts.append('path')
  .attr('stroke', '#fff')
  .attr('stroke-width', ANT_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(maskSegmentB2));
