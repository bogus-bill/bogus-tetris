function multiplyNode(node, count, deep) {
    for (let i = 0; i < count - 1; i++) {
        let copy = node.cloneNode(deep);
        node.parentNode.insertBefore(copy, node);
    }
}

// function isOnRightEdge(x, width){
//     return x > width;
// }

function isOnRightEdge(position, tetromino, width) {
    maxValue = Math.max(...tetromino.map(value => (value + position) % width));
    return maxValue >= width-1;
}


function isOnLeftEdge(position, tetromino, width) {
    minValue = Math.min(...tetromino.map(value => (value + position) % width));
    return minValue <= 0;
}

function isOnTopEdge(y){
    return y < 0;
}

function isOnBottomEdge(y, height){
    return y > height;
}

function isOutsideGrid(tetromino, position, width)
{
    maxValue = Math.max(...tetromino.map(value => (value + position) % width));
    minValue = Math.min(...tetromino.map(value => (value + position) % width));
    return minValue < 0 || maxValue > width-1 || (maxValue - minValue) > 2;
}

function applyUserActions(action, currentPosition)
{
    switch (action) {
        case "down":
            return currentPosition + width;
        case "left":
            if (!isOnLeftEdge(currentPosition, current, width))
                return currentPosition - 1;
        case "right":
            if (!isOnRightEdge(currentPosition, current, width))
                currentPosition += 1;
            return currentPosition;
    }
}
