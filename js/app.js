const SPEED = 100;
const width = 10;
const height = 20;

const tTetro = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1],
]

const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
]

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const allTetros = [tTetro];
// const allTetros = [tTetro, lTetromino, iTetromino, zTetromino, oTetromino];

const keyCodeMap = {
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down",
}

function chooseRandomTetro() {
    let randNum = Math.floor(Math.random() * allTetros.length);

    return allTetros[randNum];
}

document.addEventListener('DOMContentLoaded', () => {
    multiplyNode(document.querySelector('.square'), width*height, false);
    document.addEventListener('keyup', control);

    let grid = document.querySelector('.grid');
    let squares = Array.from(grid.querySelectorAll('div'));

    function initTetro()
    {
        let currentPosition = 15;
        let currentRotation = 0;
        let state = "active";
        let randTetro = chooseRandomTetro();
        let current = randTetro[currentRotation];

        return [currentPosition, currentRotation, randTetro, current, state];
    }

    function move(action)
    {
        [currentPosition, state] = applyUserActions(action, current, currentPosition, state, squares)
    }

    function freeze(currentPosition, current, state)
    /* Freeze tetromino when contact with bottom */
    {
        current.forEach (index => setSquareState(currentPosition+index, "frozen", squares));
        return initTetro();
    }

    function rotate() {
        currentRotation = (currentRotation + 1) % 4;

        let nextTetro = randTetro[currentRotation];
        [current, currentPosition] = rotateTetro(current, nextTetro, currentPosition);
    }

    function control(event) {
        undraw();
        if (keyCodeMap.hasOwnProperty(event.keyCode)){
            move(keyCodeMap[event.keyCode]);
        }
        if (event.keyCode == "32") {
            rotate();
        }
        draw();
    }

    let intervalId = window.setInterval(function(){
        undraw();
        [currentPosition, state] = onMoveDown(currentPosition, current, state, squares);
        if (state === "frozen")
        {
            [currentPosition, currentRotation, randTetro, current, state] = freeze(currentPosition, current, state);
            const lines = processLines(squares);
            if (lines)
            {
                lines.forEach(line => removeLine(line, squares));
            }
        }
        draw();
    }, SPEED);


    function draw() {
        current.forEach (index => {
            setSquareState(currentPosition + index, "drawn", squares);
        });
    }

    function undraw() {
        current.forEach (index => {
            setSquareState(currentPosition + index, "free", squares);
        });
    }

    let [currentPosition, currentRotation, randTetro, current, state] = initTetro();
    draw();
})
