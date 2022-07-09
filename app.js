const grid = document.querySelector(".grid");
const score = document.querySelector("#score");

// create block
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
let scoreCount = 0;

class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    };
};

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
];

// draw block
function drawBlocks() {
    for(let i = 0; i < blocks.length; i++){
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.left = blocks[i].bottomLeft[0] + "px";
        block.style.bottom = blocks[i].bottomLeft[1] + "px";
        grid.appendChild(block);
    }
};

drawBlocks();

// add user block
const userStartPosition = [230, 10];
let userCurrentPosition = userStartPosition;

const user = document.createElement("div");
user.classList.add("user");
drawUserBlock();
grid.appendChild(user);

// draw user block
function drawUserBlock() {
    user.style.left = userCurrentPosition[0] + "px";
    user.style.bottom = userCurrentPosition[1] + "px";
};

// move user block
function moveUserBlock(e) {
    switch (e.key) {
        case "ArrowLeft":
            if(userCurrentPosition[0] > 0){
                userCurrentPosition[0] -= 10;
                drawUserBlock();
            }
            break;
        case "ArrowRight":
            if(userCurrentPosition[0] < boardWidth - blockWidth){
                userCurrentPosition[0] += 10;
                drawUserBlock();
            }
            break;
    
        default:
            break;
    }
};

document.addEventListener("keydown", moveUserBlock);

// add a ball
const ballDiameter = 20;
const ballStartPosition = [270, 40];
let ballCurrentPosition = ballStartPosition;

const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + "px";
    ball.style.bottom = ballCurrentPosition[1] + "px";
};

// move the ball
let timerId = null;
let xDirection = 2;
let yDirection = 2;

function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkCollision();
};

timerId = setInterval(moveBall, 30);

// check for collisions
function checkCollision() {
    // check for block collision
    for(let i = 0; i < blocks.length; i++){
        if(
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ){
            const allBlocks = Array.from(document.querySelectorAll(".block"));
            allBlocks[i].classList.remove("block");
            blocks.splice(i,1);
            changeDirection();
            scoreCount++;
            score.innerHTML = scoreCount;
        }
    }

    // check for wall collisions
    if(
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
    ){
        changeDirection();
    }

    //check for user block collision
    if(
        (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight)
    ){
        changeDirection();
    }

    // check for game over
    if(ballCurrentPosition[1] <= 0){
        clearInterval(timerId);
        score.innerHTML = "GAME OVER!";

        document.removeEventListener("keydown", moveUserBlock);
    }

    //check for win
    if(blocks.length === 0){
        score.innerHTML = "YOU WIN!";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUserBlock);
    }
};

// change direction
function changeDirection() {
    if(xDirection === 2 && yDirection === 2){
        yDirection = -2;
        return;
    }
    if(xDirection === 2 && yDirection === -2){
        xDirection = -2;
        return
    }
    if(xDirection === -2 && yDirection === -2){
        yDirection = 2;
        return;
    }
    if(xDirection === -2 && yDirection === 2){
        xDirection = 2;
        return;
    }
};