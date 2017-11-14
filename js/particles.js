var particleLand = {
	maxParticles : 25,
	size : 4,
	sizeRandom : 5,
	speed : 2,
	speedRandom : 1.2,
	// Lifespan in frames
	lifeSpan : 5,
	lifeSpanRandom : 7,
	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	angle : 0,
	startColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	// Only applies when fastMode is off, specifies how sharp the gradients are drawn
	sharpness : 20,
	sharpnessRandom : 10,
	// Random spread from origin
	spread : 8,
	// How many rames should this last
	duration : 10,
	// Will draw squares instead of circle gradients
	fastMode : true,
	gravity : {
		x : 0,
		y : -0.1
	},
	// sensible values are 0-3
	jitter : 0
}

var particleWater = {
	maxParticles : 25,
	size : 4,
	sizeRandom : 5,
	speed : 2,
	speedRandom : 1.2,
	// Lifespan in frames
	lifeSpan : 5,
	lifeSpanRandom : 7,
	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	angle : 0,
	startColour : [13, 174, 255, 255],
	endColour : [13, 174, 255, 255],
	endColour : [13, 174, 255, 255],
	// Only applies when fastMode is off, specifies how sharp the gradients are drawn
	sharpness : 5,
	sharpnessRandom : 10,
	// Random spread from origin
	spread : 15,
	// How many rames should this last
	duration : 10,
	// Will draw squares instead of circle gradients
	fastMode : true,
	gravity : {
		x : 0,
		y : -1
	},
	// sensible values are 0-3
	jitter : 0
}

var particleSecondJump = {
	maxParticles : 5,
	size : 3,
	sizeRandom : 2,
	speed : 1,
	speedRandom : 1.2,
	// Lifespan in frames
	lifeSpan : 3,
	lifeSpanRandom : 4,
	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	angle : 180,
	startColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	// Random spread from origin
	spread : 5,
	// How many frames should this last
	duration : 10,
	// Will draw squares instead of circle gradients
	fastMode : true,
	gravity : {
		x : 0,
		y : 0.5
	},
	// sensible values are 0-3
	jitter : 1
}

var particleRun = {
	maxParticles : 20,
	size : 1,
	sizeRandom : 4,
	speed : 1,
	speedRandom : 1.2,
	// Lifespan in frames
	lifeSpan : 5,
	lifeSpanRandom : 7,
	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	angle : 272,
	startColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	endColour : [255, 255, 255, 255],
	// Only applies when fastMode is off, specifies how sharp the gradients are drawn
	sharpness : 20,
	sharpnessRandom : 10,
	// Random spread from origin
	spread : 2,
	// How many frames should this last
	duration : 5,
	// Will draw squares instead of circle gradients
	fastMode : true,
	gravity : {
		x : 0,
		y : -0.1
	},
	// sensible values are 0-3
	jitter : 0
}

var particleHitwall = {
	maxParticles : 20,
	size : 2,
	sizeRandom : 4,
	speed : 3,
	speedRandom : 1.2,
	// Lifespan in frames
	lifeSpan : 5,
	lifeSpanRandom : 7,
	// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
	angle : 260,
	startColour : [255, 255, 0, 255],
	endColour : [255, 255, 0, 255],
	endColour : [255, 255, 0, 255],
	// Only applies when fastMode is off, specifies how sharp the gradients are drawn
	sharpness : 20,
	sharpnessRandom : 10,
	// Random spread from origin
	spread : 8,
	// How many frames should this last
	duration : 5,
	// Will draw squares instead of circle gradients
	fastMode : true,
	gravity : {
		x : 0,
		y : 0
	},
	// sensible values are 0-3
	jitter : 0
}