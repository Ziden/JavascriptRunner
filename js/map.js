var tileSets = {
	sand1 : [0, 0],
	hud : [1, 0],
	grass1 : [0, 1],
	bush1 : [3, 2],
	cactus1 : [4, 2],
	water1 : [3, 1],
	dirt : [0, 2]
};

function genFloor(type, xx, yy) {
	var tile = placeEntity("2D, Canvas, " + type + ", Chao,Collision", xx, yy, 1);
	if (Math.floor(Math.random() * 6) == 1) {
		var decoType = "bush1";
		if (type == "sand1") {
			decoType = "cactus1";
		}
		placeEntity("2D, Canvas," + decoType, xx, Config.Height - 21 - 21, 0);
	}
	return tile;
}

function chancePct(percentage) {
	return Math.floor(Math.random() * 100) <= percentage;
}

// place a entity on the canvas
function placeEntity(Components, xx, yy, zz) {
	var tile = Crafty.e(Components).attr({
			x : xx,
			y : yy,
			z : zz,
		});
	// ad the entity to the list, so it can be removed when the screen goes away
	// so we dont waste CPU/Memory
	var linhaCache = (Data.blockIndex > Config.BlocksInScreen ? Config.BlocksInScreen : Data.blockIndex)
	Data.tileList[linhaCache].push(tile);
	return tile;
}

// generate the new blockset for the run
//// EACH LAND TYPE IS REPRESENTED BY A "BLOCK" THAT IS A 15 TILES TILED BLOCK
function geraBloco() {

	// ad the new block, as we havent hit 4 (the limit);
	Data.tileList.push(new Array());
	var level = Data.blockIndex / 3;
	// generating the new phase
	// responsible for the level generation
	//generateSimpleJump("grass1");
	//if (false==true) {
        if (level <= 1) {
            generateFlat("sand1");
        } else { //if (level > 1 && level < 3) {
            if (chancePct(5)) {
                generateFlat("sand1");
            } else if (chancePct(35)) {
                generateSimpleJump("sand1");
            } else if (chancePct(70)) {
                generatePipeJump("sand1");
            } else {
                generateSimpleJump("grass1");
            }
        }
	//}

	// cleaning old entities

	if (Data.tileList.length > Config.BlocksInScreen) {
		var tilesVelhos = Data.tileList.shift();
		var maxx = tilesVelhos.length;
		var canvas = $("canvas");
		while (maxx--) {
			if (tilesVelhos[maxx].has("Particles")) {}
			tilesVelhos[maxx].destroy();
		}
	}
	Data.blockIndex++;
}

////// FLAT BLOCK LAND
function generateFlat(type) {
	var xx = Data.lastBlock;
	var max = Data.lastBlock + Data.blockSize;
	while (xx < max) {
		genFloor(type, xx, Config.Height - 21);
		xx += 21;
		Data.lastBlock = xx;
	}
}

function generatePipe(pipeSize, xPipe, type, w) {
	var yPipe = 0;
	var pipeY = Config.Height - (21*4) - (Math.floor(Math.random() * 6)) * 21;
	var pipeEnd = pipeY + (pipeSize * 21);
	while (yPipe < Config.Height - 21) {
		if (yPipe >= pipeY && yPipe < pipeY + (pipeSize * 21)) {
			yPipe += 21;
			continue;
		}
		var tile = undefined;
		// borders deserve a cooler tile
		if (yPipe == pipeY - 21 || yPipe == pipeY + (pipeSize * 21))
			tile = placeEntity("2D, Canvas, " + type + ", wall, Collision" + (yPipe == pipeY + (pipeSize * 21) ? ",Chao" : ""), xPipe, yPipe, 0);
		else
			tile = placeEntity("2D, Canvas, dirt, wall, Collision", xPipe, yPipe, 0);
		if (yPipe < pipeY) {
			tile.origin("center");
			tile.rotation = 180;
		}
		yPipe += 21;
	}
	if (w != undefined) {
		console.log("GENERATING LARGER PIPE");
		while (w != 0) {
			xPipe += 21;
			yPipe = 0;
			while (yPipe < Config.Height - 21) {
				if (yPipe >= pipeY && yPipe < pipeY + (pipeSize * 21)) {
					yPipe += 21;
					continue;
				}
				var tile = undefined;
				// borders deserve a cooler tile
				if (yPipe == pipeY - 21 || yPipe == pipeY + (pipeSize * 21))
					tile = placeEntity("2D, Canvas, " + type + ", wall, Collision" + (yPipe == pipeY + (pipeSize * 21) ? ",Chao" : ""), xPipe, yPipe, 0);
				else
					tile = placeEntity("2D, Canvas, dirt, wall, Collision", xPipe, yPipe, 0);
				if (yPipe < pipeY) {
					tile.origin("center");
					tile.rotation = 180;
				}
				yPipe += 21;
			}
			w--;
		}
	}
}

////// JUMP BETWEEN 2 SPOTS
function generatePipeJump(type) {
	var xx = Data.lastBlock;
	var xPipe = xx;// + (Math.floor(Math.random() * 2) * 21);
	var top = 0;
	var pipeSize = 3;
	var max = Data.lastBlock + Data.blockSize;
	var yPipe = 0;
	generatePipe(3, xPipe, type, Math.floor(Math.random()*2)+1);
    if(chancePct(35)) {
        generatePipe(3, xPipe+(21*7), type, 2);
    }
	while (xx < max) {
		//if(xx!=xPipe) {
		genFloor(type, xx, Config.Height - 21);
		//}
		xx += 21;
		Data.lastBlock = xx;
	}
}

/// WATER SIMPLE JUMP
function generateSimpleJump(type) {
    type = "grass1";
	var xx = Data.lastBlock;
    var iniX = xx;
	var max = Data.lastBlock + Data.blockSize;
	var jumpSize = Math.floor(Math.random() * 5) + 1;
	var loops = 0;
	while (xx < max) {
		var tile = undefined;
		if (loops > jumpSize) {
            if (loops==jumpSize+3 && chancePct(35)) {
				generatePipe(4, iniX-21, type);
			}
			tile = genFloor(type, xx, Config.Height - 21);
		} else {
			tile = placeEntity("2D, Canvas, water1, waterkill, Collision", xx, Config.Height - 21, 1);
			tile.collision(
				new Crafty.polygon([0, 12], [0, 21], [12, 21], [21, 12]));
		}

		if (tile.has("Chao")) {
			if (chancePct(20)) {
				var decoType = "bush1";
				if (type == "sand1") {
					decoType = "cactus1";
				}
				placeEntity("2D, Canvas, " + decoType + "", xx, Config.Height - 21 - 21, 1);
			}
		}
		loops++;
		xx += 21;
		Data.lastBlock = xx;
	}
}
