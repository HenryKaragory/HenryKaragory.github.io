    var KEY_W = 87;
	var KEY_S = 83;
	var KEY_A = 65;
	var KEY_D= 68;
	var PODWIDTH = 20;
	var PODHEIGHT = 20;
	var SPEED = 10;

		class Vec{
			constructor(x = 0,y = 0){
				this.x=x;
				this.y = y;
			}
		}

		class Snake{
			constructor(posx,posy,velx,vely){
				this.pos = new Vec(posx,posy);
				this.dim = new Vec(PODWIDTH,PODHEIGHT);
				this.speed = new Vec(velx,vely);
				this.turn = [];
				this.turnSpeed = [];
			}

			top(){
				return this.pos.y;
			}

			bottom(){
				return this.pos.y + this.dim.y;
			}

			left(){
				return this.pos.x;
			}

			right(){
				return this.pos.x + this.dim.x;
			}
		}

		class Food{
			constructor(posx,posy){
				this.pos = new Vec(posx,posy);
				this.dim = new Vec(PODWIDTH,PODHEIGHT);
			}

			top(){
				return this.pos.y;
			}

			bottom(){
				return this.pos.y + this.dim.y;
			}

			left(){
				return this.pos.x;
			}

			right(){
				return this.pos.x + this.dim.x;
			}
		}

		class Game{
			constructor(canvas){
			this.canvas = canvas;
			this.context = this.canvas.getContext('2d');


			this.snakePods = [new Snake(this.canvas.width/2,this.canvas.height/2,SPEED,0)];
			this.food = new Food(this.foodPost('width'),this.foodPost('height'));
			}

			draw(){
				this.context.fillStyle = '#66ffff';
				this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

				for(var i =0; i<this.snakePods.length;i++){
					this.drawSnakePod(this.snakePods[i]);
				}
				this.drawSnakePod(this.food);
			}

			update(runs){
				if(runs%10==0){
					this.turn();
					for(var i = 0; i<this.snakePods.length;i++){
						this.snakePods[i].pos.x += this.snakePods[i].speed.x;
						this.snakePods[i].pos.y += this.snakePods[i].speed.y;
						if(this.outOfBounds()){
							this.gameOver();
						}
					}
				}
				if(this.foodEaten(this.snakePods[0],this.food)){
					this.eatFood();
				}
				this.draw();
			}


			drawSnakePod(snakePod){
				this.context.fillStyle = 'white';
				this.context.fillRect(snakePod.pos.x,snakePod.pos.y,snakePod.dim.x,snakePod.dim.y);
			}


			setTurn(posx,posy,dir){
				var snakePods = this.snakePods
				if(dir == 'left'){
					for(var i = 0;i<snakePods.length;i++){
						console.log('setturn');
						var turn = this.snakePods[i].turn;
						var turnSpeed = this.snakePods[i].turnSpeed;

						turn.push(new Vec());
						turnSpeed.push(new Vec());
						turn[turn.length-1].x = posx;
						turn[turn.length-1].y = posy;
						turnSpeed[turnSpeed.length-1].x = -SPEED;
						turnSpeed[turnSpeed.length-1].y = 0;
					}
				}else if (dir =='right'){
					for(var i = 0;i<snakePods.length;i++){
						var turn = this.snakePods[i].turn;
						var turnSpeed = this.snakePods[i].turnSpeed;

						turn.push(new Vec());
						turnSpeed.push(new Vec());
						turn[turn.length-1].x = posx;
						turn[turn.length-1].y = posy;
						turnSpeed[turnSpeed.length-1].x = SPEED;
						turnSpeed[turnSpeed.length-1].y = 0;
					}
				}else if (dir =='up'){
					for(var i = 0;i<snakePods.length;i++){
						var turn = this.snakePods[i].turn;
						var turnSpeed = this.snakePods[i].turnSpeed;

						turn.push(new Vec());
						turnSpeed.push(new Vec());
						turn[turn.length-1].x = posx;
						turn[turn.length-1].y = posy;
						turnSpeed[turnSpeed.length-1].x = 0;
						turnSpeed[turnSpeed.length-1].y = -SPEED;
					}
				}else if(dir =='down'){
					for(var i = 0;i<snakePods.length;i++){
						var turn = this.snakePods[i].turn;
						var turnSpeed = this.snakePods[i].turnSpeed;

						turn.push(new Vec());
						turnSpeed.push(new Vec());
						turn[turn.length-1].x = posx;
						turn[turn.length-1].y = posy;
						turnSpeed[turnSpeed.length-1].x = 0;
						turnSpeed[turnSpeed.length-1].y = SPEED;
					}
				}
			}

			turn(){
				var snakePods = this.snakePods;
				for(var i = 0;i<snakePods.length;i++){
						var turn = this.snakePods[i].turn[0];
						var turnSpeed = snakePods[i].turnSpeed[0];

						if(turn && snakePods[i].pos.x == turn.x && snakePods[i].pos.y == turn.y){
							this.clearSpeed(snakePods[i]);
							snakePods[i].speed.x = turnSpeed.x;
							snakePods[i].speed.y = turnSpeed.y;
							snakePods[i].turn.shift();
							snakePods[i].turnSpeed.shift();
							console.log(snakePods);
						}
					}

			}

			eatFood(){
				this.food = new Food(this.foodPost('width'),this.foodPost('height'));
				this.growSnake();
			}


			growSnake(){
				var snakePod = this.snakePods[0];

				if(snakePod.speed.x == -SPEED){
					var snake = new Snake(snakePod.pos.x -10,snakePod.pos.y,snakePod.speed.x,snakePod.speed.y);
					this.snakePods.splice(0,0,snake);
				}else if(snakePod.speed.x == SPEED){
					var snake = new Snake(snakePod.pos.x +10,snakePod.pos.y,snakePod.speed.x,snakePod.speed.y);
					this.snakePods.splice(0,0,snake);
				}else if(snakePod.speed.y == -SPEED){
					var snake = new Snake(snakePod.pos.x,snakePod.pos.y-10,snakePod.speed.x,snakePod.speed.y);
					this.snakePods.splice(0,0,snake);
				}else{
					var snake = new Snake(snakePod.pos.x,snakePod.pos.y+10,snakePod.speed.x,snakePod.speed.y);
					this.snakePods.splice(0,0,snake);
				}
			}

			drawFood(snakePod){
				this.context.fillStyle = 'red';
				this.context.fillRect(snakePod.pos.x,snakePod.pos.y,snakePod.dim.x,snakePod.dim.y);
			}

			foodPost(dim){
			    if(dim=='width'){
			        var num = Math.floor(this.canvas.width * Math.random());
			    }else if(dim == 'height'){
			        var num = Math.floor(this.canvas.height * Math.random());
			    }
				return num -num%10;
			}

			foodEaten(snake, food){
				return (snake.top() == food.top() && snake.left() == food.left());
			}

			clearSpeed(snakePod){
					snakePod.speed.y =0;
					snakePod.speed.x =0;
			}

			outOfBounds(){
				var snakePod = this.snakePods[0];
				if(snakePod.top()<0 || snakePod.left()<0 ||
				snakePod.right()>this.canvas.width || snakePod.bottom()>this.canvas.height){
				return true;}
			}

			gameOver(){
				console.log('gameover');
			}

		}


		var $canvas = $('#canvas');
		var game = new Game($canvas[0]);
		var runs=0;
		function callback(millis){
				game.update((runs));
				runs +=1;
				requestAnimationFrame(callback);
		}


		$(document).ready(function(){
		    setTimeout($('#instructions').empty(),5000)
			$(document).on('keydown',function(event){
				if(event.keyCode == KEY_A){
					game.setTurn(game.snakePods[0].pos.x,game.snakePods[0].pos.y,'left');
				}
				if(event.keyCode == KEY_D){
					game.setTurn(game.snakePods[0].pos.x,game.snakePods[0].pos.y,'right');
				}
				if(event.keyCode == KEY_W){
					game.setTurn(game.snakePods[0].pos.x,game.snakePods[0].pos.y,'up');
				}
				if(event.keyCode == KEY_S){
					game.setTurn(game.snakePods[0].pos.x,game.snakePods[0].pos.y,'down');
				}else{
				}
			});

			callback();
		});