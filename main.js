
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

var mouse = {
    x : undefined,
    y : undefined
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

function mouseDown(event) {
    switch (event.button) {
        case 0:
            leftBtn = true;
        break;

        case 2:
            rightBtn = true;
        break;
    }
}

function mouseUp(event) {
    switch (event.button) {
        case 0:
            leftBtn = false;
        break;

        case 2:
            rightBtn = false;
        break;
    }
}

function onKeyDown(event) {
    let keyCode = event.keyCode;
    switch (keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
        case 16: //shift
            boost = true;
            break;
  }
}

function onKeyUp(event) {
    let keyCode = event.keyCode;
    switch (keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
        case 16: //shift
            boost = false;
            break;
    }
}

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var boost = false
var rightBtn = false;
var leftBtn = false;
var multifire = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

function randomColor(colors){
    colors[Math.floor(Math.random() * colors.lentgh)]  ;  
}

function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeProjectile(index){
    setTimeout(() => {
        projectiles.splice(index, 1)
    }, 0)
}


class Player{
    constructor(x, y, radius, color, speed){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), false);
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        this.draw();

        if (keyD == true) { //right
            player.x += this.speed;
        }
        if (keyS == true) { //down
            player.y += this.speed;
        }
        if (keyA == true) { // left
            player.x -= this.speed;
        }
        if (keyW == true) { //up
            player.y -= this.speed;
        }
        if (boost == true) { //boost
            this.speed = playerParams.speed*2;
        }else this.speed = playerParams.speed;

        if (multifire == true) {
            this.color = "red";
        }else this.color = "blue";
        
    }
}

class Projectile{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), false);
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        this.draw();
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
    }    
}


var playerParams = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 20,
    color: 'blue',
    speed: 2
}

var player = new Player(playerParams.x, playerParams.y, playerParams.radius, playerParams.color, playerParams.speed);
const projectiles = [];

//create projectiles
function createProjectile(){
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x)

    const velocity = {
        x: Math.cos(angle) * player.speed*2,
        y: Math.sin(angle) * player.speed*2 
    }
    var projectileParams = {
        x: player.x,
        y: player.y,
        radius: 10,
        color: `hsl(${randomIntFromRange(0, 360)}, 50%, 50%)`,
        velocity
    }

    projectiles.push(new Projectile(projectileParams.x, projectileParams.y, projectileParams.radius, projectileParams.color, projectileParams.velocity));
}


function animate(){
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);    
    requestAnimationFrame(animate)
    
    projectiles.forEach((element, index) => {
        element.update()

        if (element.x - element.radius < 0 || element.x + element.radius > canvas.width ||
            element.y - element.radius < 0 || element.y + element.radius > canvas.height){

            removeProjectile(index)
        }
    })

    if (rightBtn == true && multifire == true) {
        createProjectile()        
    }else if (leftBtn == true) {
        createProjectile()
        leftBtn = false
    }
    
    player.update();
}

var time = 10000;

function allowMultifire(){
    if (multifire == true) {
        multifire = false;
        time = 10000;
    }else{
        multifire = true;
        time = 3000;
    }
    console.log(time + " " + multifire);

    setTimeout(allowMultifire, time);
}
setTimeout(allowMultifire, time);
animate()

