//board
let board
let boardwidth = 360
let boardheight = 640
let context

//bird
let birdwidth = 34
let birdheight = 24
let birdX = boardwidth/8
let birdY = boardheight/2
let birdImg

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}

//pipes
let pipeArray = []
let pipeWidth = 64 // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512
let pipeX = boardwidth
let pipeY = 0

let topPipeImg
let bottomPipeImg

//physics
let velocityX = -2 //pipes moving left speed
let velocityY = 0 //bird jump speed
let gravity = 0.4

let gameOver = false
let highestScore = 0
let score = 0

window.onload = function(){
    board = document.getElementById("board")
    board.height = boardheight
    board.width = boardwidth
    context = board.getContext("2d") //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "blue"
    // context.fillRect(bird.x, bird.y, bird.width, bird.height)

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybg.png"
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImg = new Image()
    topPipeImg.src = "./greenpillar.png"

    bottomPipeImg = new Image()
    bottomPipeImg.src = "./greenpillar2.png"

    requestAnimationFrame(update)
    setInterval(placePipes, 1400) //Every 1.4 secs  
    
    // adding the event listeners
    document.addEventListener("keydown", moveBird)
    document.addEventListener("touchstart", moveBird);
}

function update(){
    requestAnimationFrame(update)
    if(gameOver){
        return
    }
    context.clearRect(0, 0, board.width, board.height)

    //bird
    velocityY += gravity
    //bird.y += velocityY
    bird.y = Math.max(bird.y + velocityY, 0) //apply gravity tothe current bird.y, limit the bird.y to the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if(bird.y > board.height){
        gameOver = true
    }

    //pipes
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5 // because it'll count for two pipes top and bottom
            pipe.passed = true
        }

        if(detectCollision(bird, pipe)){
            gameOver = true
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift() // removes first element from the array
    }

    // Update highest score if the current score is greater
    if (score > highestScore) {
        highestScore = score;
    } 

    //score
    displayScore()

    if(gameOver){
        displayGameOver()
    }
}

function placePipes(){
    if(gameOver) {
        return
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2)
    let openingspace = board.height / 4

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe)

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingspace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe)

}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "touchstart"){
        //jump
        velocityY = -6

        //reset game
        if(gameOver){
            resetGame()
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function displayGameOver(){
    // Draw grey background box
    let boxWidth = 300
    let boxHeight = 150
    let boxX = (boardwidth - boxWidth) / 2
    let boxY = (boardheight - boxHeight) / 2
    
    context.fillStyle = "grey"
    context.fillRect(boxX, boxY, boxWidth, boxHeight)
    
    // Draw "Game Over" text
    context.font = "36px Arial"
    context.fillStyle = "red"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText("Game Over!", boardwidth / 2, boardheight / 2 - 20)
    
    // Draw "Press any key to play again" text
    context.font = "16px Arial"
    context.fillStyle = "white"
    context.fillText("Press any key to play again", boardwidth / 2, boardheight / 2 + 20)
}

function resetGame(){
    if (score > highestScore) {
        highestScore = score; // Update highest score if the current score is greater
    }
    bird.y = birdY
    pipeArray = []
    score = 0
    gameOver = false
}

// New function to display score
function displayScore() {
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(score, boardwidth / 2, 5);

    // Highest Score
    context.font = "20px sans-serif";
    context.fillText("Highest: " + highestScore, boardwidth / 2, 50);
}

//window.addEventListener("keydown", moveBird);
