// Constants
var TWO_PI = 2 * Math.PI;
var SCALE = 400;

// Initial data array
var lissajous = [];
for (var i = 0, len = SCALE / 2; i <= len; i++) {
    lissajous.push({
        x: SCALE/2.1 * Math.cos(    TWO_PI * i/len) + SCALE/2
    });
}

// Path rendering function
var pathFn = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate('linear');

// SVG element
var svg = d3.select('body').append('svg')
    .attr('width', SCALE)
    .attr('height', SCALE);

// Path (wave)
var path = svg.append('path')
    .attr('stroke', '#222')
    .attr('stroke-width', 3)
    .attr('fill', 'none');

// Cycles y value of data array
var w = 0;
function cycleLissajous() {
    for (var i = 0, len = SCALE / 2; i <= len; i++) {
        lissajous[i].y = SCALE/2.1 * Math.sin(3 * TWO_PI * i/len + w/360 * TWO_PI) + SCALE/2;
    }
}

// Call cycle to update wave animation
setInterval(function () {
    w++;
    if (w === 360) w = 0;
    cycleLissajous();
    path.attr('d', pathFn(lissajous));
}, 10);