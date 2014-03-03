var map = (function() {
	var _TILE_SIZE_ = 40;
	var _GRID_COLOR = "#FFFFFF";
	
	var	$map;
	var	width, height;
	var gridWidth, gridHeight;
	var offsetLeft, offsetTop;
	var ctx;
	
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
	function calcX(x) {
		return x * _TILE_SIZE_ - offsetLeft;
	}
	function calcY(y) {
		return y * _TILE_SIZE_ - offsetTop;
	}
	
	function Map() {}
	
	Map.create = function() {
		getHTML();
		this.refreshSize();
		this.drawGrid();
		this.fillCenter();
	};
	Map.refreshSize = function() {
		width = $map.width();
		height = $map.height();
		gridWidth = Math.ceil(width / _TILE_SIZE_);
		gridHeight = Math.ceil(height / _TILE_SIZE_);
		offsetLeft = Math.ceil((gridWidth * _TILE_SIZE_ - width) / 2);
		offsetTop = Math.ceil((gridHeight * _TILE_SIZE_ - height) / 2);
		
		$map.attr({ width:width, height:height });
	};
	Map.drawGrid = function() {
		drawGrid_vertical(0);
		drawGrid_horizontal(0);
		ctx.strokeStyle = _GRID_COLOR;
		ctx.stroke();
	};
	Map.getCenter = function() {
		return {
			x	: Math.floor(gridWidth / 2),
			y	: Math.floor(gridHeight / 2)
		};
	};
	Map.fillCenter = function() {
		center = this.getCenter();
		drawTile(center.x, center.y, "#00F");
	}
	
	return Map;
})();