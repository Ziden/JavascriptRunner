var Data = {};

var Config = {
	Scale : 1,
	Lines : 10,
	Columns : 20,
	TileSize : 21,
	Width : 200,
	Height : 100,
	BlocksInScreen : 3,
	Rendering : "Canvas"
}

var d1 = undefined;
var d2 = undefined;

$(document).ready(function () {initGame();});

function initGame() {


	isGameOn = true;
	Config.Width = Config.Columns * Config.TileSize;
	Config.Height = Config.Lines * Config.TileSize;

	if (isMobile) {
		var ratio = window.devicePixelRatio || 1;
		var screenW = (window.innerWidth > 0) ? window.innerWidth : screen.width;
		var screenH = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		var needMoreTilesX = Math.floor((screenW - Config.Width) / 21);
		var needMoreTilesY = Math.floor((screenH - Config.Height) / 21);

		Config.Columns += needMoreTilesX;
		Config.Lines += needMoreTilesY;

		Config.Width = Config.Columns * Config.TileSize;
		Config.Height = Config.Lines * Config.TileSize;
		
		var missingX = screenW - (Config.Columns*21);
		Config.Width += missingX;
		
		var missingY = screenH - (Config.Lines*21);
		Config.Height += missingY;
	}

	Crafty.mobile = true;
	Crafty.pixelart = true;
	Crafty.timer.FPS(50);
	Crafty.init(Config.Width, Config.Height, document.getElementById('game'));
    //Crafty.canvas.init();
	Crafty.background("black");

	Crafty.c("ViewportRelative", {
		_viewportPreviousX : 0,
		_viewportPreviousY : 0,
		_viewportStartX : 0,
		_viewportStartY : 0,
		init : function () {
			this.bind("EnterFrame", this._frame);
		},
		_frame : function () {
			if (this._viewportPreviousX != Crafty.viewport._x) {
				this._viewportStartX = Crafty.viewport._x;

				this.x += this._viewportPreviousX
				this.x -= Crafty.viewport._x;

				this._viewportPreviousX = this._viewportStartX;
			}

			if (this._viewportPreviousY != Crafty.viewport._y) {
				this._viewportStartY = Crafty.viewport._y;

				this.x += this._viewportPreviousY
				this.x -= Crafty.viewport._y;

				this._viewportPreviousX = this._viewportStartX;
			}
		}
	});

	Crafty.scene("loading", function () {
		Crafty.background("black");
		Crafty.pixelart = true;
		Crafty.sprite(21, "img/tiles.png", tileSets);
		Crafty.sprite(32, "img/char.png", {
			PlayerSprite : [0, 0]
		});

		Crafty.viewport.x = 0;

		Data = {
			lastBlock : 0,
			blockSize : Config.TileSize * Config.Width / 25,
			screenX : 0,
			chara : undefined,
			vetorY : 0,
			frameCount : 0,
			useParticles : true,
			blockIndex : 0,
			tileList : new Array(),
			speed : 3,
			screen : "main"
		}

		Crafty.load(["img/tiles.png", "img/char.png", "img/desert_BG.png", "img/but.png", "img/logo.png"], function () {});

		Crafty.sprite(200, 100, "img/miniDesert.png", {
			desertBG : [0, 0]
		});

		Crafty.sprite(166, 54, "img/but.png", {
			button : [0, 0]
		});

		Crafty.sprite(807, 120, "img/logo.png", {
			logo : [0, 0]
		});

		Crafty.scene("ini");
	});

	Crafty.scene("ini", function () {
		Data.screen = "ini";
		Crafty.background("black");

		Crafty.e("2D,  " + Config.Rendering + ", logo").attr({
			x : 0,
			y : 0,
			w : Config.Width,
			h : Config.Height / 4,
			z : 2
		});

		Crafty.e("2D,  " + Config.Rendering + ", button, Mouse").attr({
			x : Config.Width / 2 - 50,
			y : Config.Height / 2,
			w : 100,
			h : 35,
			z : 1
		}).bind("Click", function () {
			Crafty.scene("main");
		});
		Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").textFont({
			size : '18px',
			weight : 'bold'
		}).attr({
			x : Config.Width / 2 - 50 + 30,
			y : Config.Height / 2 + 6,
			z : 5
		}).text("Run !");

		d1 = Crafty.e("2D, Canvas, desertBG").attr({
				x : 0,
				y : 0,
				z : 0,
				w:800,
				h:400
			});
		d2 = Crafty.e("2D, Canvas, desertBG").attr({
				x : 800,
				y : 0,
				z : 0,
				w:800,
				h:400
			});
		d1.h = Config.Height + Config.Height * 0.3;
		d2.h = Config.Height + Config.Height * 0.3;

	});

	Crafty.scene("Score", function () {
		Data.screen = "Score";
		Crafty.viewport.x = 0;
		Crafty.sprite(166, 54, "but.png", {
			button : [0, 0]
		});
		Crafty.background("white");
		
		
		Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").textFont({
			size : '18px',
			weight : 'bold'
		}).attr({
			x : Config.Width / 2 - 50+35,
			y : Config.Height / 2+6,
			z:2
		}).text(Math.round(Data.screenX / 100));
		Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").textFont({
			size : '20px',
			weight : 'bold'
		}).attr({
			x : Config.Width / 2 - 50,
			y : Config.Height / 2 - 30
		}).text("Score:");
		Crafty.e("2D,  " + Config.Rendering + ", button").attr({
			x : Config.Width / 2 - 50,
			y : Config.Height/2,
			w : 100,
			h : 35,
			z : 1
		});
		
		
		Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").textFont({
			size : '20px',
			weight : 'bold'
		}).attr({
			x : Config.Width / 2 - 50,
			y : Config.Height / 2 - 30+70
		}).text("Max:");
		Crafty.e("2D,  " + Config.Rendering + ", button").attr({
			x : Config.Width / 2 - 50,
			y : Config.Height/2+70,
			w : 100,
			h : 35,
			z : 1
		});
		
		
		var maxScore = $.jStorage.get("max", 0);
		
		if (maxScore != undefined) {
			var score = Math.round(Data.screenX / 100);
			if (score > maxScore) {
				Data.maxScore = score;
				$.jStorage.set("max", Data.maxScore);
			}
		} else {
			Data.maxScore = maxScore;
		}
		Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").textFont({
			size : '18px',
			weight : 'bold'
		}).attr({
			x : Config.Width / 2 - 50+35,
			y : Config.Height / 2+6+70,
			z:2
		}).text($.jStorage.get("max", 0));
	});

	Crafty.scene("main", function () {

		Data.maxScore = $.jStorage.get("max", 0);
		Crafty.background("white");
		Crafty.viewport.x = 0;
		Data = {
			lastBlock : 0,
			blockSize : Config.TileSize * Config.Width / 25,
			screenX : 0,
			chara : undefined,
			vetorY : 0,
			frameCount : 0,
			useParticles : true,
			blockIndex : 0,
			tileList : new Array(),
			speed : 3,
			screen : "main"
		}

		d1 = Crafty.e("2D, Canvas, desertBG").attr({
				x : 0,
				y : 0,
				z : 0,
				w:800,
				h:400
			});
		d2 = Crafty.e("2D, Canvas, desertBG").attr({
				x : 800,
				y : 0,
				z : 0,
				w:800,
				h:400
			});
		d1.h = Config.Height + Config.Height * 0.3;
		d2.h = Config.Height + Config.Height * 0.3;

		createCharacter();
		
	});

	Crafty.scene("loading");

	// register mouse functions
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", click);
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", releaseClick);
};




