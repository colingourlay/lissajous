// Constants
var TWO_PI = Math.PI * 2;
var ABC_A = 1;
var ABC_B = 3;
var POINTS = 120;
var LISSAJOUS_COLOR = '#1C1C1C';
var ANTS_COLOR = '#363636';

// Constants (tweakable)
var WIDTH = 400;
var HEIGHT = Math.round(WIDTH / 4 * 3);
var THICKNESS = Math.round(WIDTH / TWO_PI);
var ANT_THICKNESS = Math.round(THICKNESS / 3);
var MASK_THICKNESS = Math.round(THICKNESS * 1.25);

var pathFn = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('linear');

var lissajous = [];
for (var i = 0, len = POINTS; i <= len; i++) {
  lissajous.push({
    x: Math.round((WIDTH - THICKNESS) / 2 * Math.cos(ABC_A * TWO_PI * i / len) + WIDTH / 2),
    y: Math.round((HEIGHT - THICKNESS) / 2 * Math.sin(ABC_B * TWO_PI * i / len) + HEIGHT / 2)
  });
}

var maskSegmentA = lissajous.slice(15, 26);
var maskSegmentA2 = lissajous.slice(0, 27);
var maskSegmentB = lissajous.slice(75, 86);
var maskSegmentB2 = lissajous.slice(60, 87);
var antsASegment = lissajous.slice(102).concat(lissajous.slice(0, 39));
var antsBSegment = lissajous.slice(42, 99);

var svg = d3.select('body').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT);

var lissajousPath = svg.append('path')
  .attr('class', 'lissajous')
  .attr('mask', 'url(#mask-lissajous)')
  .attr('d', pathFn(lissajous));

var DASHOFFSET = lissajousPath[0][0].getTotalLength();
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
