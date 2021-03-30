function multiplyNode(node, count, deep) {
    for (let i = 0; i < count - 1; i++) {
        const copy = node.cloneNode(deep);
        // copy.appendChild(document.createTextNode(i));
        node.parentNode.insertBefore(copy, node);
    }
}

function isOnRightEdge(position, tetromino, width) {
    let maxValue = Math.max(...tetromino.map(value => (value + position) % width));
    return maxValue >= width-1;
}

function isOnLeftEdge(position, tetromino, width) {
    let minValue = Math.min(...tetromino.map(value => (value + position) % width));
    return minValue <= 0;
}

function toHeight(position, width)
{
    return Math.floor(position / width);
}

function squareState(position, squares)
{
    let square = squares[position];
    if (!square)
    {
        return "off";
    }
    const classList = square.classList;

    if (classList.contains('frozen'))
    {
        return "frozen"
    }
    if (classList.contains('drawn'))
    {
        return "drawn"
    }
    return "free";
}

function isOnBottomEdge(position, tetromino, squares){
    const maxYValue = Math.max(...tetromino.map(value => toHeight(value + position, width)));
    const maxYIndices = tetromino.filter(value => toHeight(position + value, width) == maxYValue);

    const contactGridBottom = maxYValue >= height - 1;

    const validPos = isValidTetroPosition(position + width, tetromino, squares);

    return contactGridBottom || !validPos;
}

function allPositionsFree(position, tetromino, squares)
{
    return isValidTetroPosition(position + width, tetromino, squares);
}

function isValidTetroPosition(position, tetromino, squares)
{
    let mapped = tetromino.map(value => [squareState(value + position, squares)]);
    return mapped.reduce((acc, value) => acc && value == "free");
}

function isValidPosition(position, squares)
{
    let stateOfPos = squareState(position, squares);
    return squareState(position, squares) === "free";
}

function isOutsideGridLeft(tetromino, position, width)
{
    let maxValue = Math.max(...tetromino.map(value => (value + position) % width));
    let minValue = Math.min(...tetromino.map(value => (value + position) % width));

    return maxValue > width-1 || (maxValue - minValue) > 2;
}

function isOutsideGridRight(tetromino, position, width)
{
    let minValue = Math.min(...tetromino.map(value => (value + position) % width));
    return minValue < 0;
}

function onMoveDown(position, tetromino, state, squares) {
    if (isOnBottomEdge(position, tetromino, squares)) {
        return [position, "frozen"];
    }
    else {
        return [position + width, state];
    }
}

function setSquareState(position, state, squares)
{
    if (state === "frozen")
    {
        squares[position].classList.add("frozen");
        squares[position].classList.remove("drawn");
        squares[position].classList.remove("removing");
        squares[position].classList.remove("destroyed");
    }
    if (state === "drawn")
    {
        squares[position].classList.add("drawn");
        squares[position].classList.remove("frozen");
        squares[position].classList.remove("removing");
        squares[position].classList.remove("destroyed");
    }
    if (state === "free")
    {
        squares[position].classList.remove("drawn");
        squares[position].classList.remove("frozen");
        squares[position].classList.remove("removing");
        squares[position].classList.remove("destroyed");
    }
    if (state === "removing")
    {
        squares[position].classList.remove("frozen");
        squares[position].classList.remove("drawn");
        squares[position].classList.add("destroyed");
        squares[position].classList.add("removing");
    }
}

function addScore(score)
{
    const scoreInput = document.getElementById("score");
    const currentScore = parseInt(scoreInput.getAttribute("value"));
    scoreInput.setAttribute("value", currentScore + score);
}

function removeLine(line, squares)
{
    addScore(10);
    for (x=0; x<width; x++)
    {
        setSquareState(line*width+x, "removing", squares);
    }
    setTimeout(function() {
        for (y=line; y > 0; y--)
        {
            for (x=0; x<width; x++)
            {
                if (y > 0)
                {
                    let aboveSquareState = squareState((y-1)*width+x, squares);
                    if (aboveSquareState != "removing" && aboveSquareState != "drawn")
                        setSquareState(y*width+x, aboveSquareState, squares);
                }
            }
        }
    }, 1000);

}

function isLine(yPosition, squares)
{
    for (x=0; x<width; x++)
    {
        const isFrozenSquare = squareState(x + yPosition*width, squares) == "frozen";
        if (!isFrozenSquare)
        {
            return false;
        }
    }
    return true;
}

function processLines(squares)
{
    let lines = [];
    for (let y=0; y<height; y++)
    {
        if (isLine(y, squares))
        {
            lines.push(y);
        }
    }
    return lines;
}

function rotateTetro(tetromino, nextTetromino, position)
{
    minTetro = Math.min(...tetromino.map(value => (value + position) % width));
    minNextTetro = Math.min(...nextTetromino.map(value => (value + position) % width));
    maxTetro = Math.max(...tetromino.map(value => (value + position) % width));
    maxNextTetro = Math.max(...nextTetromino.map(value => (value + position) % width));

    if (minTetro - minNextTetro > 2)
    {
        return [nextTetromino, position - 1]
    }

    if (maxNextTetro - maxTetro > 2)
    {
        return [nextTetromino, position + 1]
    }

    if (maxNextTetro > height-1)
    {
        return [tetromino, position];
    }

    return [nextTetromino, position];
}

function onMoveLeft(position, tetromino, state, squares) {
    if (isOnLeftEdge(position, tetromino, width))
        return [position, state];

    if (isValidTetroPosition(position - 1, tetromino, squares))
        return [position - 1, state]

    return [position, state];
}

function onMoveRight(position, tetromino, state, squares) {
    if (isOnRightEdge(position, tetromino, width))
        return [position, state];

    if (isValidTetroPosition(position + 1, tetromino, squares))
        return [position + 1, state]

    return [position, state];
}

function applyUserActions(action, current, currentPosition, state, squares)
{
    switch (action) {
        case "down":
            return onMoveDown(currentPosition, current, state, squares);
        case "left":
            return onMoveLeft(currentPosition, current, state, squares);
        case "right":
            return onMoveRight(currentPosition, current, state, squares);
    }

    return [currentPosition, state];
}
