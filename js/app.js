const width = 10;
const height = 20;

const tTetro = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1],
]

const allTetros = [tTetro, tTetro, tTetro];

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
    multiplyNode(document.querySelector('.square'), 20*10, false);
    document.addEventListener('keyup', control);

    let grid = document.querySelector('.grid');
    let squares = Array.from(grid.querySelectorAll('div'));

    function initTetro()
    {
        let currentPosition = 50;
        let currentRotation = 0;
        let randTetro = chooseRandomTetro();
        let current = randTetro[currentRotation];

        return [currentPosition, currentRotation, randTetro, current];
    }

    function move(action)
    {
        currentPosition = applyUserActions(action, currentPosition)
    }

    function freeze(current)
    /* Freeze tetromino when contact with bottom */
    {
        squares[currentPosition + index].classList.add('frozen');
    }

    function rotate() {
        currentRotation = (currentRotation + 1) % 4;

        let nextTetro = randTetro[currentRotation];
        if (!isOutsideGrid(nextTetro, currentPosition, width))
        {
            current = nextTetro;
        }
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

    function draw() {
        current.forEach (index => {

            squares[currentPosition + index].classList.add('drawn');
        });
    }

    function undraw() {
        current.forEach (index => {
            squares[currentPosition + index].classList.remove('drawn');
        });
    }

    let [currentPosition, currentRotation, randTetro, current] = initTetro();
    draw();
})
