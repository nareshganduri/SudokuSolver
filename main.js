let adjMat = [];
let graph = [];

class Vertex {
    constructor(row, col) {
        this.color = -1;
        this.row = row;
        this.col = col;
        this.fixed = false;
    }
}

function init() {
    // allocate 81x81 space for the adjacency matrix
    for (let i = 0; i < 81; i++) {
        adjMat[i] = [];
        for (let j = 0; j < 81; j++) {
            adjMat[i][j] = 0;
        }
    }

    // all horizontal lines are connected
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let currSq = i * 9 + j;

            for (let k = 0; k < 9; k++) {
                let sq2 = i * 9 + k;

                if (sq2 === currSq) {
                    continue;
                }

                adjMat[currSq][sq2] = 1;
                adjMat[sq2][currSq] = 1;
            }
        }
    }

    // all vertical lines are connected
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let currSq = i * 9 + j;

            for (let k = 0; k < 9; k++) {
                let sq2 = k * 9 + j;

                if (sq2 === currSq) {
                    continue;
                }

                adjMat[currSq][sq2] = 1;
                adjMat[sq2][currSq] = 1;
            }
        }
    }

    // each 3x3 mini square is connected
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            for (let ii = i; ii < i + 3; ii++) {
                for (let jj = j; jj < j + 3; jj++) {
                    let currSq = ii * 9 + jj;

                    for (let k = i; k < i + 3; k++) {
                        for (let l = j; l < j + 3; l++) {
                            let sq2 = k * 9 + l;

                            if (sq2 == currSq) {
                                continue;
                            }

                            adjMat[currSq][sq2] = 1;
                            adjMat[sq2][currSq] = 1;
                        }
                    }
                }
            }
        }
    }
}

function clearPuzzle() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let sq = document.getElementById(`sq${i}${j}`);
            sq.value = '';
        }
    }
}

/**
 * Checks to see if a node is connected to another node with the same color.
 * If it is, the node's color will not work
 * @param {number} x the x coordinate of the node
 * @param {number} y the y coordinate of the node
 */
function colorWorks(x, y) {
    let idx = x * 9 + y;

    // check every connection to see if the node's color is shared somewhere
    for (let i = 0; i < 81; i++) {
        if (adjMat[idx][i] === 0) {
            continue; // not connected - skip this node
        }

        let [x2, y2] = [Math.floor(i / 9), i % 9];
        if (graph[x2][y2].color === graph[x][y].color) {
            return false; // color is shared so this one doesn't work
        }
    }

    return true;
}

function printPuzzle() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let node = graph[i][j];
            let sq = document.getElementById(`sq${i}${j}`);

            sq.value = node.color;
        }
    }
}

function solvePuzzle() {
    // initialize the graph
    for (let i = 0; i < 9; i++) {
        graph[i] = [];

        for (let j = 0; j < 9; j++) {
            let sq = document.getElementById(`sq${i}${j}`);

            graph[i][j] = new Vertex(i, j);

            if (sq.value !== '') {
                graph[i][j].fixed = true;
                graph[i][j].color = parseInt(sq.value);
            }
        }
    }

    // initialize a stack for backtracking
    let stack = [];
    let stackIdx = 0;

    // populate the stack and check if the puzzle is valid
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (graph[i][j].fixed === false) {
                stack.push(graph[i][j]);
            } else {
                let valid = colorWorks(i, j);
                if (valid === false) {
                    console.log('Unsolvable!');
                    return;
                }
            }
        }
    }

    for (;;) {
        let node = stack[stackIdx];
        if (node === undefined) {
            console.log('Unsolvable!');
            return;
        }

        if (node.color == 9) {
            // every color has been tried. We need to go back to the
            // previous node.
            node.color = -1;
            stackIdx--;
        } else {
            if (node.color === -1) {
                // we haven't assigned this node a color yet.
                // start with color 1 and see where we can go from here
                node.color = 1;
            } else {
                // we need to try a new color because the current one
                // does not work
                node.color++;
            }

            // check if the color works so far.
            let valid = colorWorks(node.row, node.col);
            if (valid === true) {
                // color works so far, so move on to the next node if
                // there is one
                if (stackIdx == stack.length - 1) {
                    break;
                } else {
                    stackIdx++;
                    continue;
                }
            } else {
                // color does not work
                continue;
            }
        }
        
    }

    printPuzzle();
}