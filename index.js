let FPS = 60;
let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
let gravity = 0.4;

let ctx;
let particle_list = [];
let mx = null, my = null; //滑鼠xy座標

//定義 particle 類別

let Particle = function (x, y){
	this.x = x;
	this.y = y;
};

Particle.prototype = {
	x: null,
	y: null,
	vx: 0,
	vy: 0,
	radius: 0,
	color: null,
	isRemove: false,

	create: function(){
		this.vx = Math.random() * 6 - 3;   //-3~3之間的數值
		this.vy = Math.random() * (-6) - 2; //-8~-2之間的數值
		this.radius = Math.random()* 20 +5;
		let r = 150;
		let g = Math.floor(Math.random()* 100 + 155);
		let b = Math.floor(Math.random()* 155 + 100);
		this.color = `rgb(${r}, ${g}, ${b} )`;
		// this.color = 'rgba(150, 150, 150, 1 )';
	},
	update: function () {
		this.vy += gravity;
		this.x +=this.vx;
		this.y +=this.vy;
		this.radius *= 0.97;
		if(this.x <0 || this.x > screen_width || this.y > screen.height){
			this.isRemove = true;
		}
	},
	draw: function (){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, false);
		ctx.fill();
	}
}

window.onload = function(){
	init();
}

let init = function(){

	
	let canvas = document.querySelector('#mycanvas');
	if( !canvas || !canvas.getContext){
		return false;
	}
	canvas.width = screen_width;
	canvas.height = screen_height;
	ctx = canvas.getContext('2d');

	canvas.addEventListener('mousemove', updateMousePos, false);
	canvas.addEventListener('mouseout', resetMousePos, false);

	loop(); //主迴圈
}

const updateMousePos = function (e){
	let rect = e.target.getBoundingClientRect();
	mx = e.clientX - rect.left;
	my = e.clientY - rect.top;
};

const resetMousePos = function(e){
	mx = null; my = null;
}
const loop = function(){
	add();
	update();
	draw();
	setTimeout(loop, 1000/FPS);
}
const add = ()=>{
	if(mx !== null && my !== null){
		//建立實體
		let p = new Particle(mx, my);
		p.create();

		particle_list.push(p);
		console.log('長度：',particle_list.length);
	}
}

const update = () => {
	let list = [];
	for (let i = 0; i < particle_list.length; i++) {
		particle_list[i].update();

		if (!particle_list[i].isRemove) {
			list.push(particle_list[i]);
		}
		particle_list = list;
	}
}

const draw = ()=>{
	
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(0, 0, screen_width, screen_height);

	//描繪顆粒
	ctx.save();
	ctx.globalCompositeOperation = 'lighter';

	for(let i=0;i<particle_list.length; i++){
		particle_list[i].draw();
	}
	ctx.restore();
}