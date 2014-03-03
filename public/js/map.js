var map = (function() {
	var _TILE_SIZE_ = 40;
	var _GRID_COLOR = "#CCCCCC";
	var _GRID_COORD_COLOR = "#CCCCCC";
	
	var	$map;
	var	width, height;
	var gridWidth, gridHeight;
	var offsetLeft, offsetTop;
	var cx, cy;
	var ctx;
	
	var config = {
		grid	: true,
		coord	: true
	}
	
	function getHTML() {
		$map = $('#map');
		ctx = document.getElementById('map').getContext('2d');
	}
	function drawGrid_vertical(x) {
		ctx.moveTo(calcX(x), 0);
		ctx.lineTo(calcX(x), height);
		if (x < gridWidth) {
			drawGrid_vertical(++x);
		}
	}
	function drawGrid_horizontal(y) {
		ctx.moveTo(0, calcY(y));
		ctx.lineTo(width, calcY(y));
		if (y < gridHeight) {
			drawGrid_horizontal(++y);
		}
	}
	function drawTile(x, y, fill) {
		ctx.fillStyle = fill;
		ctx.fillRect(calcX(x), calcY(y), _TILE_SIZE_, _TILE_SIZE_);	
	}
	function drawText(x, y, text, color) {
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		ctx.textBaseline ="middle"; 
		ctx.fillText(text, calcX(x, _TILE_SIZE_ / 2), calcY(y, 20), _TILE_SIZE_);
	}
	function calcX(x, offset) {
		return x * _TILE_SIZE_ - offsetLeft + (offset || 0);
	}
	function calcY(y, offset) {
		return y * _TILE_SIZE_ - offsetTop + (offset || 0);
	}
	
	function Map() {}
	
	Map.create = function() {
		this.refreshSize();
		this.fillCenter();
		if (config.grid) {
			this.drawGrid();
		}
		if (config.coord) {
			this.drawGridCoord();
		}
		this.log();
	};
	Map.init = function(x, y) {
		getHTML();
		this.setCoord(x, y);
		this.create();
		$(window).resize(this.onResize.bind(this));
		$(document).keydown(this.onKeyDown.bind(this));
	};
	Map.onResize = function() {
		this.create();
	};
	Map.onKeyDown = function(event) {
		key = event.which;
		console.log(key);
		if (key === 37) { // Left
			cx -= 1;
		} else if (key === 38) { // Up
			cy += 1;
		} else if (key === 39) { // Right
			cx += 1;
		} else if (key === 40) { // Bottom
			cy -= 1;
		}
		this.update();
	}
	Map.refreshSize = function() {
		width = $map.width();
		height = $map.height();
		gridWidth = Math.ceil(width / _TILE_SIZE_) + 1;
		gridHeight = Math.ceil(height / _TILE_SIZE_) + 1;
		if (gridHeight % 2 === 0) {
			gridHeight -= 1;
		}
		if (gridWidth % 2 === 0) {
			gridWidth -= 1;
		}
		offsetLeft = Math.round((gridWidth * _TILE_SIZE_ - width) / 2);
		offsetTop = Math.round((gridHeight * _TILE_SIZE_ - height) / 2);
		
		$map.attr({ width:width, height:height });
	};
	Map.drawGrid = function() {
		drawGrid_vertical(0);
		drawGrid_horizontal(0);
		ctx.strokeStyle = _GRID_COLOR;
		ctx.stroke();
	};
	Map.drawGridCoord = function() {
		center = this.getCenter();
		for (x=0; x<gridWidth; x++) {
			for (y=0; y<gridHeight; y++) {
				tile_x = x - center.x + cx;
				tile_y = -(y - center.y) + cy;
				drawText(x, y, tile_x.toString()+", "+tile_y.toString(), _GRID_COORD_COLOR);
			}
		}	
	};
	Map.getCenter = function() {
		return {
			x	: Math.ceil(gridWidth / 2) - 1,
			y	: Math.ceil(gridHeight / 2) - 1
		};
	};
	Map.fillCenter = function() {
		center = this.getCenter();
		drawTile(center.x, center.y, "#333333");
	};
	Map.log = function() {
		size = {
			width	: width,
			height	: height,
			gridWidth	: gridWidth,
			gridHeight	: gridHeight,
			offsetLeft	: offsetLeft,
			offsetTop	: offsetTop
		}
		console.log($map, size, this.getCenter());
	};
	Map.coord = function(x, y) {
		this.clear();
		this.setCoord(x, y);
		this.fillCenter();
		if (config.grid) {
			this.drawGrid();
		}
		if (config.coord) {
			this.drawGridCoord();
		}
	};
	Map.update = function() {
		this.coord(cx, cy);
	};
	Map.setCoord = function(x, y) {
		cx = x;
		cy = y;
	}
	Map.clear = function() {
		$map.attr('width',width);
		//ctx.clearRect(0, 0, width, height);
	}
	
	return Map;
})();