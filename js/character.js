///// MAIN GAME UPDATE LOOP
var characterUpdate = function () {

	Crafty.viewport.x -= Data.speed;
	Data.screenX += Data.speed;
	Data.frameCount++;
	d1.x += (Data.speed/2);
	d2.x += (Data.speed/2);
	
	if(d1.x+800 < Data.screenX) {
		d1.x += 1600;
	}
	if(d2.x+800 < Data.screenX) {
		d2.x += 1600;
	}
	
	// removing old tiles , free memory etc

    if(Data.chara.fallin) {
        Data.chara.y += 4;
    }
    
    // PHYSICS
	if (Data.chara.jumpCount == 0 && Data.chara.isJumping) {
		Data.vetorY -= 0.5;
		Data.chara.jumpHeight += 0.5;
		Data.chara.origin("center");
		if (Data.chara.jumpHeight > 5) {
			if (Data.chara.isJumping) {
				Data.chara.jumpCount++;
				Data.chara.animate("jumpFloat", -1);
				Data.chara.isJumping = false;
			}
		}
		// double jump
	} else if (Data.chara.jumpCount == 1 && Data.chara.isJumping) {
		Data.chara.origin("center");
		Data.vetorY -= 0.5;
		Data.chara.jumpHeight += 0.5;
		if (Data.chara.jumpHeight > 4) {
			if (Data.chara.isJumping) {
				Data.chara.jumpCount++;
				Data.chara.animate("jumpFloat", -1);
				Data.chara.isJumping = false;
			}
		}

	} else {
		if (!Data.chara.inFloor) {
			// gravity pulls
			Data.vetorY += 0.3;
			if (Data.vetorY > 0 && Data.chara.isPlaying("jumpFloat")) {
				Data.chara.animate("jumpFall");
			}
		} else {
			Data.vetorY = 0;
		}
	}
    
    if (Data.chara.y > Config.Height + 250) {
		Crafty.scene("Score");
	}
    
	if (Data.chara.dead)
		return;

	
	// handling fancy rotation
	if (Data.chara.isJumping) {
		if (Data.chara.rotation > -50) {
			Data.chara.rotation -= 5;
		}
	} else {
		if (!Data.chara.inFloor) {
			if (Data.chara.rotation < 30) {
				Data.chara.rotation += 2;
			}
		} else {
			Data.chara.rotation = 0;
		}
	}
    
    // WALK SMOKE
    if (Data.chara.inFloor && Data.frameCount % 10 == 0) {
		if (Data.useParticles) {
			var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleRun).attr({
					x : Data.chara.x + 20,
					y : Data.chara.y + 30
				});
			particle.hascanvas = true;
			var linhaCache = (Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1);
			if (linhaCache < 0)
				linhaCache = 0;
			Data.tileList[linhaCache].push(particle);
		}
	}

    

	Data.score.text(Math.round(Data.screenX / 100));
	Data.chara.x += Data.speed;
	Data.chara.y += Data.vetorY;

	

	// nao tem nada a frente
	if (Data.lastBlock < Data.screenX + Config.Width) {
		geraBloco();
	} else {}
}

/// MOUSE
function click(e) {
	if (e.button > 1)
		return;
	// first jump
	if(Data.screen=="ini") return;
	if (Data.screen == "Score") {
		Crafty.scene("main");
		Data.vetorY = 0;
		Data.chara.isJumping = false;
		Data.chara.jumpCount = 3;
	}
	if (Data.chara.dead)
		return;
	if (Data.chara.jumpCount == 0) {
		Data.chara.isJumping = true;
		Data.chara.rotation = 0;
		Data.chara.inFloor = false;
		Data.chara.animate("jumpStart", -1);
		Data.chara.y -= 0.1;
		// double jump
	} else if (Data.chara.jumpCount == 1) {
		Data.chara.isJumping = true;
		Data.chara.inFloor = false;
		Data.chara.rotation = 0;
		Data.vetorY = 0;
		var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleSecondJump).attr({
				x : Data.chara.x + 25,
				y : Data.chara.y + 15
			});
		particle.hascanvas = true;
		var linhaCache = (Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1);
		if (linhaCache < 0)
			linhaCache = 0;
		Data.tileList[linhaCache].push(particle);
		Data.chara.animate("jumpStart", -1);
		Data.chara.jumpHeight = 0;

	}
}

function releaseClick(e) {
	// you can only cancel the first jump releasing the mouse
	if(Data.screen=="ini") return;
	if (Data.chara.dead)
		return;
	if (Data.chara.isJumping) {
		Data.chara.animate("jumpFloat", -1);
		if (Data.chara.isJumping) {
			Data.chara.jumpCount++;
		}
		Data.chara.isJumping = false;
	}

}

// SETUP CHARACTER
function createCharacter() {
	Data.chara = Crafty.e("" + Config.Rendering + ", 2D, Collision, SpriteAnimation,PlayerSprite").reel("run", 600, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]])
		.reel("jumpStart", 100, [[1, 4]])
		.reel("jumpFloat", 100, [[3, 4]])
		.reel("jumpFall", 100, [[2, 7]])
		.reel("hitWall", 100, [[0, 3]])
        .reel("fallDead", 100, [[7, 6]])
		.animate("run", -1).attr({
			x : (Config.Width/2)-32,
			y : Config.Height - 21 - 32,
			w : 32,
			h : 32,
			z : 2
		});
	Data.vetorY = 0;
	Data.chara.collision(
		new Crafty.polygon(8, 12, 8, 32, 22, 32, 22, 12))

	Data.score = Crafty.e("2D, " + Config.Rendering + ", Text,ViewportRelative").attr({
			x : 10,
			y : 10
		}).text("0").textFont({ size: '20px', weight: 'bold' });;

	Data.chara.bind("EnterFrame", characterUpdate);
	Data.chara.jumpCount = 0;

	// PHYSICS COLLISION CHECKS

	Data.chara.checkHits("waterkill");
	Data.chara.checkHits("wall");
	Data.chara.checkHits('Chao') // check for collisions with entities that have the Solid component in each frame
	.bind("HitOn", function (hitData) {
		if (hitData[0].obj.has("waterkill")) {
			if (Data.useParticles) {
				Data.chara.dead = true;
                Data.chara.fallin = true;
				Data.vetorY = 0;
				var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleWater).attr({
						x : Data.chara.x + 20,
						y : Data.chara.y + 30
					});
				Data.speed = 0;
				particle.hascanvas = true;
				Data.tileList[(Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1)].push(particle);
			}
		} else if (hitData[0].obj.has("Chao")) {
			// only accept total vertical collision to step on floor
			
            if(Data.chara.fallin) {
                Data.chara.rotation = 0;
                Data.chara.animate("fallDead", -1);
                Data.chara.fallin = false;
                var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleLand).attr({
						x : Data.chara.x + 20,
						y : Data.chara.y + 30
					});
				Data.speed = 0;
				particle.hascanvas = true;
				Data.tileList[(Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1)].push(particle);
                setTimeout(function() {
                    Crafty.scene("Score");
                }, 800);
            }
            
			if (hitData[0].obj.has("wall")) {
				if (hitData[0].normal.x != 0) {
                    hitWall(hitData);
				}
			}

			if (hitData[0].normal.x != 0) {
				if (hitData[1] != undefined) {
					if (hitData[1].normal.x != 0) {
						return;
					}
				} else
					return;
			}

			if (Data.chara.inFloor || Data.chara.dead)
				return;
			Data.chara.inFloor = true;
			Data.chara.jumpCount = 0;
			var nextTile = Data.chara.y / 21;
			//Data.chara.y = (nextTile * 21);
			Data.chara.y = hitData[0].obj.y - 30;
			Data.chara.jumpHeight = 0;
			Data.chara.dead = false;
			Data.chara.rotation = -10;
			Data.vetorY = 0;
			if (!Data.chara.isPlaying("run"))
				Data.chara.animate("run", -1);
			if (Data.useParticles) {
				var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleLand).attr({
						x : Data.chara.x + 20,
						y : Data.chara.y + 30
					});
				particle.hascanvas = true;
				var linhaCache = (Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1);
				if (linhaCache < 0)
					linhaCache = 0;
				Data.tileList[linhaCache].push(particle);
			}
		} else if (hitData[0].obj.has("wall")) {
			hitWall(hitData);
		}

	})
	.bind("HitOff", function (hitData) {

		if (hitData == "Chao" || (hitData[0] != undefined && hitData[0].obj != undefined && hitData[0].obj.has("Chao"))) {
			if (Data.chara.inFloor == true) {
				Data.chara.inFloor = false;
				Data.chara.rotation = 0;
			}
		}

	});
}

function hitWall(hitData) {
            Data.speed = 0;
            Data.chara.inFloor = false;
			Data.chara.dead = true;
			Data.chara.animate("hitWall");
			Data.vetorY = 0;
			Data.chara.rotation = 0;
			Data.chara.x = hitData[0].obj.x - 24;
			if (hitData[0].normal.x == 0) {
				Data.chara.origin("center");
				Data.chara.rotation = -90;
			} else {
				var particle = Crafty.e("2D," + Config.Rendering + ",Particles").particles(particleHitwall).attr({
						x : Data.chara.x + 20,
						y : Data.chara.y + 30
					});
				particle.hascanvas = true;
				var linhaCache = (Data.blockIndex > Config.BlocksInScreen - 1 ? Config.BlocksInScreen - 1 : Data.blockIndex - 1);
				if (linhaCache < 0)
					linhaCache = 0;
				Data.tileList[linhaCache].push(particle);
			}
            setTimeout(function() {
                Data.chara.fallin = true;
            }, 500);
}
