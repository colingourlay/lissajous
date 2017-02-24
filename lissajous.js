// Constants
var TWO_PI = 2 * Math.PI;
var ABC_A = 1;
var ABC_B = 3;
var WIDTH = 400;
var HEIGHT = Math.round(WIDTH / 4 * 3);
var POINTS = Math.round(WIDTH * HEIGHT / 1000);
var THICKNESS = Math.round(WIDTH / TWO_PI);
var ANT_THICKNESS = Math.round(THICKNESS / 3);
var MASK_THICKNESS = Math.round(THICKNESS * 1.25);
var LISSAJOUS_COLOR = '#1C1C1C';
var ANTS_COLOR = '#363636';

var lissajous = [];
for (var i = 0, len = POINTS; i <= len; i++) {
  lissajous.push({
    x: Math.round((WIDTH - THICKNESS) / 2 * Math.cos(ABC_A * TWO_PI * i / len) + WIDTH / 2),
    y: Math.round((HEIGHT - THICKNESS) / 2 * Math.sin(ABC_B * TWO_PI * i / len) + HEIGHT / 2)
  });
}

var lissajousA = lissajous.slice(lissajous.length - 2).concat(lissajous.slice(0, POINTS / 4 + 2));
var lissajousB = lissajous.slice(POINTS / 4 - 1, POINTS / 2 + 2);
var lissajousC = lissajous.slice(POINTS / 2 - 1, POINTS / 4 * 3 + 2);
var lissajousD = lissajous.slice(POINTS / 4 * 3 - 1).concat(lissajous.slice(0, 2));

// Path rendering function
var pathFn = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('linear');

// SVG element
var svg = d3.select('body').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT);


svg.append('path')
  .attr('class', 'lissajous lissajous--a')
  .attr('d', pathFn(lissajousA));

svg.append('path')
  .attr('class', 'lissajous lissajous--c')
  .attr('d', pathFn(lissajousC));

svg.append('path')
  .attr('class', 'lissajous lissajous--b')
  .attr('mask', 'url(#mask-a)')
  .attr('d', pathFn(lissajousB));

svg.append('path')
  .attr('class', 'lissajous lissajous--d')
  .attr('mask', 'url(#mask-b)')
  .attr('d', pathFn(lissajousD));

var antsA = svg.append('path')
  .attr('class', 'lissajousAnts lissajousAnts--a')
  .attr('d', pathFn(lissajousA));

var antsB = svg.append('path')
  .attr('class', 'lissajousAnts lissajousAnts--c')
  .attr('d', pathFn(lissajousC));

var antsC = svg.append('path')
  .attr('class', 'lissajousAnts lissajousAnts--b')
  .attr('mask', 'url(#mask-a)')
  .attr('d', pathFn(lissajousB));

var antsD = svg.append('path')
  .attr('class', 'lissajousAnts lissajousAnts--d')
  .attr('mask', 'url(#mask-b)')
  .attr('d', pathFn(lissajousD));

var pathFull = svg.append('path')
  .attr('d', pathFn(lissajous));

var DASHOFFSET = pathFull[0][0].getTotalLength();
var GAP_LENGTH = DASHOFFSET / 32;
var DASH_LENGTH = DASHOFFSET / 4 - GAP_LENGTH;
var DASHARRAY = [Math.round(DASH_LENGTH), Math.round(GAP_LENGTH)].join();

pathFull.remove();

var defs = svg.append('defs');

defs.append('style').text(`
  @keyframes lissajousAnts {
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
  .lissajousAnts {
    stroke: ${ANTS_COLOR};
    stroke-width: ${ANT_THICKNESS};
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: ${DASHARRAY};
    stroke-dashoffset: ${Math.round(DASHOFFSET)};
    fill: none;
    animation: lissajousAnts 10s linear infinite;
  }
`);

var maskA = defs.append('mask')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .attr('maskUnits', 'userSpaceOnUse')
  .attr('id', 'mask-a');

var maskB = defs.append('mask')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .attr('maskUnits', 'userSpaceOnUse')
  .attr('id', 'mask-b');

maskA.append('rect')
  .attr('fill', '#fff')
  .attr('stroke', 'none')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

maskA.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(lissajousC));

maskB.append('rect')
  .attr('fill', '#fff')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

maskB.append('path')
  .attr('stroke', '#000')
  .attr('stroke-width', MASK_THICKNESS)
  .attr('fill', 'none')
  .attr('d', pathFn(lissajousA));
