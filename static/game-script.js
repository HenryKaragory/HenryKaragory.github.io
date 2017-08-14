var BOARD_HEIGHT = parseFloat($('#board').css('height'));
	var BOARD_WIDTH = parseFloat($('#board').css('width'));
	var BOARD_LEFT = BOARD_WIDTH/8.0;
	var SCORE = 0;

	var HERO_WIDTH = 20;
	var HERO_HEIGHT = 20;
	var HERO_X = BOARD_LEFT+BOARD_WIDTH/2;
	var HERO_Y = 500;
	var HERO_SPEED = 15;

	var MONSTER_WIDTH = 25;
	var MONSTER_HEIGHT = 25;

	var LASER_HEIGHT=50;
	var LASER_WIDTH = 2;
	var totalLaser =0;

	var LEFT_KEY = 37;
	var UP_KEY = 38;
	var RIGHT_KEY = 39;
	var DOWN_KEY = 40;
	var SPACEBAR =32;

	var DIFFICULTY = 10;
	var PLAYING = 1;

	var KEYMAP = {};
	KEYMAP[LEFT_KEY]=false;
	KEYMAP[RIGHT_KEY]=false;
	KEYMAP[UP_KEY]=false;
	KEYMAP[DOWN_KEY]=false;
	KEYMAP[SPACEBAR]=false;

	var monsterArray = new Array();
	var laserArray = new Array();

	var startInterval = 0;

	function Character(element, height, width, x, y){
		this.element = element;
		this.height = height;
		this.width = width;
		this.x = x;
		this.y = y;
	}

	//check to see if two characters are overlapping
	function overlapCheck(character1, character2){
		if(!(character1 == null) && !(character2 == null)){
			var c1top = character1.y;
			var c1height = character1.height;
			var c1left = character1.x;
			var c1width = character1.width;

			var c2top = character2.y;
			var c2height = character2.height;
			var c2left = character2.x;
			var c2width = character2.width;

			//make sure the x logic is correct
			var xintersect = !((c1left +c1width<c2left) || (c2left + c2width < c1left));
			var yintersect = !((c1top + c1height < c2top) || (c1top> c2top + c2height));

			if(xintersect && yintersect){
				return true;
			}
			return false;
		}
	}

	//create a new monster
	//lower value of DIFFICULTY corresponds to harder game
	function createMonster(){
		var random = Math.random()*DIFFICULTY;
		random = parseInt(random);

		if(random == 0){
			var monsterId = 'monster' + parseInt(Math.random()*100000000);
			var monsterHtml = '<div class = "monster" id = "' + monsterId + '"></div>';
			var xStart = BOARD_LEFT + parseInt(Math.random()*BOARD_WIDTH);
			var monster = new Character(monsterId,MONSTER_WIDTH,MONSTER_HEIGHT,xStart,0);

			$('#board').append(monsterHtml);
			updatePosition(monster);
			monsterArray[monsterArray.length] = monster;
		}
	}

	//advance each of the monsters
	function monsterAdvance(){
		for(var i =0;i<monsterArray.length;i++){
			var monster = monsterArray[i];
			monster.x += parseInt(20*Math.random()-10);
			monster.y += 5 + parseInt(10*Math.random());
			if(monster.y >BOARD_HEIGHT){
				$('#'+monster.element).remove();
				monsterArray.splice(i,1);
			}
			if(monster.x >BOARD_LEFT + BOARD_WIDTH){
				$('#'+monster.element).remove();
				monsterArray.splice(i,1);
			}
			updatePosition(monster);
		}
	}

	//apply the x and y coordinates fo an object to css property
	function updatePosition(Character){
		var characterId = '#' + Character.element;
		$(characterId).css('top',Character.y);
		$(characterId).css('left',Character.x);
	}

	function laserfire(){
		if(totalLaser<3){
			totalLaser+=1;
			console.log(totalLaser);

			var laserId = 'laser' + laserArray.length;
			var laserHtml = '<div class = "laser" id = "' + laserId + '"></div>';
			var laser = new Character(laserId,LASER_WIDTH,LASER_HEIGHT,hero.x+9,hero.y - LASER_HEIGHT);

			$('body').append(laserHtml);
			updatePosition(laser);
			laserArray[laserArray.length] = laser
		}
	}

	function updateLaser(){
		for(var i = 0;i<laserArray.length;i++){
			var laser = laserArray[i];
			laser.y-=12;
			if(laser.y <-LASER_HEIGHT){
				laserArray.splice(i,1);
				console.log('#' + laser.element);
				$('#' + laser.element).remove();
				totalLaser-=1;
			}
			updatePosition(laser);
		}
	}

	//update the position of each character on the screen
	//make sure the characters are all on the screen
	//check to make sure that monster and hero and laser and monster overlaps are taken care of
	function showCharacters(){
		updatePosition(hero);
		checkBounds(hero);
		updateLaser();
		monsterAdvance();

		for(var i = 0; i<monsterArray.length;i++){
			var monster = monsterArray[i];

			for(var j = 0; j<laserArray.length;j++){
				var laser = laserArray[j];

				if(overlapCheck(laser, monster)){
					monsterArray.toString();
					laserArray.toString();
					$('#' + monster.element).remove();
					$('#' + laser.element).remove();
					monsterArray.splice(i,1);
					laserArray.splice(j,1);

					totalLaser-=1;
					SCORE+=1;
					$('#score').html(SCORE.toString());
				}
			}
			if(overlapCheck(monster,hero)){
				PLAYING = 0;
			}
		}
	}

	//make sure your characters are inside of the bounds
	function checkBounds(character){
		if(character.x<BOARD_LEFT){
			character.x = BOARD_LEFT;
		}
		else if(character.y<30){
			character.y = 30;
		}
		else if(character.x + character.width > BOARD_LEFT+BOARD_WIDTH){
			character.x = BOARD_LEFT + BOARD_WIDTH-character.width;
		}
		else if(character.y+character.height>BOARD_HEIGHT){
		character.y = BOARD_HEIGHT- character.height;
		}
	}


	var hero = new Character('hero',HERO_WIDTH,HERO_HEIGHT,HERO_X,HERO_Y);

	$(document).keydown(function(event){
		var key = event.which;
		if(key in KEYMAP){
			KEYMAP[key] = true;
			if(KEYMAP[LEFT_KEY]){
				hero.x-=HERO_SPEED;
			}if(KEYMAP[RIGHT_KEY]){
				hero.x+=HERO_SPEED;
			}if(KEYMAP[UP_KEY]){
				hero.y-=HERO_SPEED;
			}if(KEYMAP[DOWN_KEY]){
				hero.y+=HERO_SPEED;
			}if(KEYMAP[SPACEBAR]){
			laserfire();
			}
		}
	});

	function cleanBoard(){
		console.log('cleaning');
		PLAYING = 1;

		$('#board').empty();
		$('#board').append('<div id = "hero"></div>');
		$("#gameover").css("display","none");
		$('#board').unbind('click');

		monsterArray.splice(0,monsterArray.length);
		showCharacters();
		mainloop();
	}

	$(document).keyup(function(event){
		if(event.which in KEYMAP){
			KEYMAP[event.which] = false;
		}
	});

	function mainloop(){
		if(PLAYING){
			if(new Date().getTime() - startInterval > 30){
				showCharacters();
				createMonster();
				startInterval = new Date().getTime();
			}
			setTimeout('mainloop();',2);
		}
		else{
			$("#gameover").css("display","initial");
			$('#board').click(function(){
			cleanBoard();
			});
		}
	}


		mainloop();
