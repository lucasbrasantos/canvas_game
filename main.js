
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const scoreboard = document.querySelector("#score")
const startGameBtn = document.querySelector("#startGameBtn")
var score = 0

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
function removeEnemy(index){
    setTimeout(() => {
        enemies.splice(index, 1)
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

        }else this.color = "white";
        
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
        
        if (multifire == true) {
            this.color = "red";
            
        }else this.color = "white";
    }    
}

class Enemy{
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
        let angle = Math.atan2(player.y - this.y, player.x - this.x)
        this.velocity = {
            x: Math.cos(angle) * player.speed * .5,
            y: Math.sin(angle) * player.speed * .5
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;        
    }
}

const particleFriction = 0.99
class Particle{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), false);
        c.fillStyle = this.color;
        c.fill();
        c.restore()
    }

    update(){
        this.draw();
        this.velocity.x *= particleFriction  
        this.velocity.y *= particleFriction  
        this.x += this.velocity.x;
        this.y += this.velocity.y;        
        this.alpha-= 0.02
    }
}


const playerParams = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 20,
    color: 'blue',
    speed: 2
}

let player = new Player(playerParams.x, playerParams.y, playerParams.radius, playerParams.color, playerParams.speed);
let projectiles = [];
let enemies = [];
let particles = [];


function init(){
    player = new Player(playerParams.x, playerParams.y, playerParams.radius, playerParams.color, playerParams.speed);
    projectiles = [];
    enemies = [];
    particles = [];
    score=0
    spawnEnemyTime = 1000
    timerMultifire = 10;
    multifire = false;

}


//create projectiles
function createProjectile(){
    const speedMultiplier = 6
    const projectileParams = {
        x: player.x,
        y: player.y,
        radius: 5,
        // color: `hsl(${randomIntFromRange(0, 360)}, 50%, 50%)`,
        color: "white"
    }

    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x)
    const velocity = {
        x: Math.cos(angle) * speedMultiplier,
        y: Math.sin(angle) * speedMultiplier 
    }

    projectiles.push(new Projectile(projectileParams.x, projectileParams.y, projectileParams.radius, projectileParams.color, velocity));
}


//create enemies
var spawnEnemyTime = 1000

function spawnEnemies(){

    const speedMultiplier = .8

    const radius = randomIntFromRange(10, 40);
    const color =  `hsl(${randomIntFromRange(0, 360)}, 50%, 40%)`;        
    var x, y;        

    if (Math.random < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    }else{
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
        
        
    const angle = Math.atan2(player.y - y, player.x - x)
    const velocity = {
        x: Math.cos(angle) * player.speed * speedMultiplier,
        y: Math.sin(angle) * player.speed * speedMultiplier
    }

    enemies.push(new Enemy(x, y, radius, color, velocity));
    
}

let animationId;
function animate(){
    scoreboard.innerHTML = `score: ${score}`
    // interval.innerHTML = `timer: ${timerMultifire}`
    animationId = requestAnimationFrame(animate);
    c.fillStyle = "rgba(0, 0, 0, 0.25)"
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    projectiles.forEach((projectile, index) => {
        projectile.update()

        //remove projectile out of screen
        if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 || projectile.y + projectile.radius > canvas.height){

            removeProjectile(index)
        }
    })

    enemies.forEach((enemy, eIndex) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)        
        
        // end game
        if (dist - player.radius - enemy.radius < 1) {
            endGame();
            cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile, pIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            //colision projectile x enemy
            if (dist - enemy.radius - projectile.radius < 1) {

                
                for (let index = 0; index < Math.floor(enemy.radius / 2); index++) {
                    const x = enemy.x
                    const y = enemy.y
                    const radius = randomIntFromRange(1, 3)
                    const velocity = {
                        x: (Math.random() - 0.5) * randomIntFromRange(1, 4),
                        y: (Math.random() - 0.5) * randomIntFromRange(1, 4),
                    }
                    particles.push(new Particle(x, y, radius, enemy.color, velocity))
                }


                if (enemy.radius - 10 >= 15) {
                    score += 10

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    
                    removeProjectile(pIndex)
                }else{
                    removeEnemy(eIndex)
                    removeProjectile(pIndex)
                    score += 25
                }
                
            }
        })

    })

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }else{
            particle.update()
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

var timerMultifire = 10; //s

function allowMultifire(){
    console.log(timerMultifire);
    if (timerMultifire == 0 && multifire == false) {
        multifire = true;
        timerMultifire = 3;
    }else if (timerMultifire == 0 && multifire == true) {
        multifire = false;
        timerMultifire = 10;
    }

    timerMultifire--;
}


startGameBtn.addEventListener('click', startGame, false)

var spawnEnemiesInterval = setInterval(spawnEnemies, spawnEnemyTime);
var multifireInterval = setInterval(allowMultifire, 1000);

clearInterval(spawnEnemiesInterval);
clearInterval(multifireInterval);

function startGame(){
    clearInterval(spawnEnemiesInterval);
    clearInterval(multifireInterval);
    // spawnEnemiesInterval = setInterval(spawnEnemies, spawnEnemyTime);
    // multifireInterval = setInterval(allowMultifire, 1000);
    init()
    document.querySelector("#ui").style.display = "none"    
    animate()
    spawnEnemies()
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);    
    spawnEnemiesInterval = setInterval(spawnEnemies, spawnEnemyTime);
    multifireInterval = setInterval(allowMultifire, 1000);
}

function endGame(){
    clearInterval(spawnEnemiesInterval);
    clearInterval(multifireInterval);
    document.querySelector("#ui").style.display = "flex";
    document.querySelector("#finalPoints").innerHTML = score;
}


