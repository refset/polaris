var ww = window.innerWidth;
var wh = window.innerHeight;

function pointInPolygon (point, vs) {
	var x = point[0], y = point[1];

	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
};
var maxcount = 500;
var numberOfSides = 6;

var ctx;
var psize;
var psize1;
var polygon;
var polygon1;
var drawgroup;

function resizeCanvas() {
	ctx = document.getElementById('moc-16').getContext('2d');
	ww = ctx.canvas.width = window.innerWidth;
	wh = ctx.canvas.height = window.innerHeight;
	psize = ww/4-ww/10;
	psize1 = ww/4-ww/10*1.3;
	polygon = [[ww/2 +  psize * Math.sin(0), wh/2 -  psize *  Math.cos(0)]]
		for (var i = 1; i <= numberOfSides;i += 1) {
			polygon.push([ww/2 + psize * Math.sin(i * 2 * Math.PI / numberOfSides), wh/2 - psize * Math.cos(i * 2 * Math.PI / numberOfSides)]);
		}
	polygon1 = [[ww/2 +  psize1 * Math.sin(0), wh/2 -  psize1 *  Math.cos(0)]]
		for (var i = 1; i <= numberOfSides;i += 1) {
			polygon1.push([ww/2 + psize1 * Math.sin(i * 2 * Math.PI / numberOfSides), wh/2 - psize1 * Math.cos(i * 2 * Math.PI / numberOfSides)]);
		}
	drawgroup = [];
	count = 0;
	done = {};
}

window.addEventListener('resize', resizeCanvas, false);
function fnGetRandomColour(iDarkLuma, iLightLuma) 
{       
	var pal = [[135,201,233],
							[255,34,11],
							[37,230,231],
							[252,255,29],
							[181,89,133],
							[29,128,195],
							[255,151,8]]
	return pal[Math.round((pal.length-1) * Math.random())]
} 

document.addEventListener('DOMContentLoaded', function() {
	resizeCanvas()

var requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000/60);
	};
})();


function loop() {
	if(count > maxcount)
		polygon = polygon1;
	fs = 		"rgba("
		+(Math.random()>0.1?(fnGetRandomColour(180,255)):[255,255,255])
		+","
		+(Math.random()>0.8?0.6:0.4)
		+")"
		fs = Math.random()>0.06?fs:"rgba(255,255,255,"+rand(0.8,0.9)+")";

	var size = Math.random()>0.5?psize/6:psize/12
		// hexagon
		var numberOfSides = 6,
				Xcenter = 0,
				Ycenter = 0;

	var c = count<maxcount?psize/12:psize/12/4;
	var max = 10000;
	var maxtest=0;
	while ((maxtest < max)
			&& !pointInPolygon([Xcenter,Ycenter],polygon)
			&& !(done[Xcenter]
				&& done[Xcenter][Ycenter]
				&& (done[Xcenter][Ycenter]>40))){
					Xcenter = Math.round(rand(ww-size)/c)*c;
					Ycenter = Math.round(rand(wh-size)/c)*c;
					maxtest++;
				}
	if(!(maxtest < max)){
		console.log("maxxed")
			return;}
	if(count < maxcount){
		if(!done[Xcenter])
			done[Xcenter]= {}
		if(!done[Xcenter][Ycenter])
			done[Xcenter][Ycenter] = 1;

		done[Xcenter][Ycenter] += 1;}

	if(drawgroup.length < 3)
		drawgroup.push([Xcenter, Ycenter, size, fs]) 
	else
	{
		drawgroup.forEach(function(d){
			var Xcenter = d[0],
		Ycenter = d[1],
		size = d[2],
		fs = d[3];
		ctx.fillStyle = fs; 

		ctx.beginPath();
		ctx.moveTo (Xcenter +  size * Math.sin(0), Ycenter -  size *  Math.cos(0));          

		for (var i = 1; i <= numberOfSides;i += 1) {
			ctx.lineTo (Xcenter + size * Math.sin(i * 2 * Math.PI / numberOfSides), Ycenter - size * Math.cos(i * 2 * Math.PI / numberOfSides));
		}

		ctx.fill();
		})
		drawgroup = []
	}
	count++;
	requestAnimFrame(loop);
}

function rand(min, max) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (max - min));
}

loop();
});