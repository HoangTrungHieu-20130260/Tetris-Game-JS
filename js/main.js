$('.btn-play').click(function () {
    $('.list-choose').css('display', 'none')
    $('.list-level').css('display', 'flex')

})
$('.btn-back').click(function () {
    $('.list-choose').css('display', 'flex')
    $('.list-level').css('display', 'none')
})

function setScore(score) {
    $('.score>.content').text(score)
}

function setLevel(level) {
    $('.number-level').text(level)
}

let shapeList = [
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [3, 0, 0],
        [3, 0, 0],
        [3, 3, 0]
    ],
    [
        [4, 4],
        [4, 4]
    ],
    [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]
    ],
    [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0]
    ]
]
let color_mapping = [
    'linear-gradient(to right bottom, #b2fefa, #0ed2f7)',  // xanh nhạt
    'linear-gradient(to right, #396afc, #2948ff)',  // xanh đậm
    'linear-gradient(to right, #fceabb, #f8b500)',  // cam
    'linear-gradient(to right bottom, #d7d2cc,#304352 )',
    'linear-gradient(to right, #ed213a, #93291e)',  // đỏ
    'linear-gradient(to right bottom, #11998e, #38ef7d)',  // xanh lá
    'linear-gradient(to right, #9d50bb, #6e48aa)', // tím
    'linear-gradient(to right, #ece9e6, #ffffff)' // màu tường
]
let row = 20 // số dòng game
let col = 10    // số cột game
let level   // level khi ấn buttuon
let count = 0   // đếm số lần click pause để xử lí
let score = 0
let gameLoop
// các ma trận hình của game
let randomNumber = Math.floor(Math.random() * 7)    // lấy số ngẫu nhiên 1 hình
let nextShape = Math.floor(Math.random() * 7)   // lấy số ngẫu nhiên hính tiếp theo
let shape = shapeList[randomNumber]     // lấy hình dựa trên số đã random
let position = {i: -1, j: 3} // vị trí ban đầu của hình
let speedGame = 700
let musicBackground = new Audio('music/theme.mp3')

function musicAll() {
    musicBackground.loop = true
    musicBackground.volume = 0.1
    musicBackground.play()
}

function musicMove() {
    let music = new Audio('music/move.mp3')
    music.volume = 0.4
    music.play()
}

function musicRotate() {
    let music = new Audio('music/rotate.mp3')
    music.volume = 0.4
    music.play()
}

function musicClearLine() {
    let music = new Audio('music/lineClear.mp3')
    music.volume = 0.4
    music.play()
}

function musicGameOver() {
    let music = new Audio('music/gameOver.mp3')
    music.volume = 0.4
    music.play()
}

$(document).ready(function () {
    $('.back-to-menu').click(function () {
        $('.display-main').css('display', 'flex')
        $('.display-game').css('display', 'none')
        $('.game-over').css('display', 'none')
        $('.pause').text("Pause")
        clearAll()
    })
    $('.over-menu').click(function () {
        $('.display-main').css('display', 'flex')
        $('.display-game').css('display', 'none')
        $('.game-over').css('display', 'none')
        clearAll()
    })
    $('.over-again').click(function () {
        $('.game-over').css('display', 'none')
        gameLoop = setInterval(function () {
            loop(shape)
        }, speedGame);
        if (level == 1)
            hideNextShape()
        if (level == 2)
            barrier()
        if (level == 3)
            loopDeleteLine = setInterval(function () {
                deleteLine()
            }, 15000)
        if (level == 4)
            setInterval(function () {
                gameLoop
            }, 1)
        if (level == 5) {
            hideNextShape()
            barrier_lv5()
            speedGame = 400
        }
    })
    $('.mute').click(function () {
        musicBackground.pause()
        $('.mute').css('display', 'none')
        $('.unmute').css('display', 'block')
    })
    $('.unmute').click(function () {
        musicBackground.play()
        $('.unmute').css('display', 'none')
        $('.mute').css('display', 'block')
    })
    $('.lv0').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 0
        setLevel(level)
        drawNextShape(shapeList[nextShape])
    })
    $('.lv1').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 1
        setLevel(level)
        hideNextShape()
    })
    $('.lv2').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 2
        setLevel(level)
        drawNextShape(shapeList[nextShape])
        barrier()
    })
    $('.lv3').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 3
        setLevel(level)
        drawNextShape(shapeList[nextShape])
        loopDeleteLine = setInterval(function () {
            deleteLine()
        }, 15000)
    })
    $('.lv4').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 4
        setLevel(level)
        drawNextShape(shapeList[nextShape])
        setInterval(function () {
            gameLoop
        }, 1)
    })
    $('.lv5').click(function () {
        $('.display-main').css('display', 'none')
        $('.display-game').css('display', 'flex')
        level = 5
        setLevel(level)
        hideNextShape()
        barrier_lv5()
        speedGame = 400

    })
    drawBoard()
    drawBoardNextShape()
    $('.number-level').text(level)
    $('.lv').click(function () {
        clearInterval(gameLoop)
        gameLoop = setInterval(function () {
            loop(shape)
        }, speedGame);
        musicAll()
    })
    $('.pause').click(function () {
        clearInterval(gameLoop)
        count++
        if (count % 2 == 0) {
            gameLoop = setInterval(function () {
                loop(shape)
            }, speedGame);
            $('.pause').text("Pause")
        } else {
            $('.pause').text("Play")
        }
    })

})

// vẽ khung bằng các div
function drawBoard() {
    for (let i = 0; i < row; i++) {
        let r = $('<div>').addClass('row');
        for (let j = 0; j < col; j++) {
            let cell = $('<div>').addClass('cell col cell' + '-' + i + '-' + j);
            r.append(cell);
        }
        $('.game').append(r)
    }
}

let boardMatrix = createBoardMatrix()

// tạo 1 ma trận khung dựa trên số lượng dòng và cột
function createBoardMatrix() {
    let matrix = [] // tạo ma trận
    for (let i = 0; i < row; i++) { // vòng lặp for mỗi dòng
        matrix.push(new Array(col).fill(0)) // mỗi dòng tạo số cột
    }
    return matrix
}

// tô màu theo vị trí i j và màu
function draw(i, j, iShape) {
    $('.cell.col.cell' + '-' + i + '-' + j).css('background', color_mapping[iShape])
}

// vẽ lên khung theo ma trận của mỗi hình
function drawBlock(shape, position) {
    // vòng lặp qua từng hàng và cột của ma trận của khung lớn
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[0].length; j++) {
            // kiểm tra vị trí đó đã có hình nào chưa nếu chưa tô lại màu ban đầu
            if (boardMatrix[i][j] == 0) {
                $('.cell.col.cell' + '-' + i + '-' + j).css('background', '#011c31')
            }
        }
    }
    // vòng lặp qua từng hàng và cột của ma trân hình
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            // nếu vị trí của hình đó khác 0 thì tô màu div với vị trí của từng index trong ma trận hình + position
            if (shape[i][j] !== 0) {
                draw(i + position.i, j + position.j, randomNumber)
            }
        }
    }
}

// vẽ khung của hình tiếp theo bằng các div
function drawBoardNextShape() {
    for (let i = 0; i < 5; i++) {
        let r = $('<div>').addClass('row');
        for (let j = 0; j < 5; j++) {
            let cell = $('<div>').addClass('next col next' + '-' + i + '-' + j);
            r.append(cell);
        }
        $('.next-shape').append(r)
    }
}

// vẽ hình tiếp theo theo nextShape đã tạo ban đầu
function drawNextShape(shape) {
    // tô màu mặc định cho từng hàng và cột của mỗi div trong khung hình tiếp theo
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            $('.next.col.next' + '-' + i + '-' + j).css('background', '#011c31')
        }
    }
    // vẽ hình tiếp theo
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0) {
                $('.next.col.next' + '-' + (i + 1) + '-' + (j + 1)).css('background', color_mapping[nextShape])
            }
        }
    }
}

function hideNextShape() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            $('.next.col.next' + '-' + i + '-' + j).css('background', 'none')
        }
    }
}

function loop(shape) {
    position.i++
    if (isColliding()) {
        position.i--
        applyShapeToBoardMatrix()
        checkLines()
        resetShape()
        if (level == 1 || level == 5) {
            hideNextShape()
        } else {
            drawNextShape(shapeList[nextShape])
        }
    } else {
        drawBlock(shape, position)
    }
    if (level == 4) {
        speedBoostLine()
    }
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[0].length; j++) {
            if (boardMatrix[i][j] != 0 && boardMatrix[i][j] != 10) {
                draw(i, j, boardMatrix[i][j] - 1)
            }
        }
    }
}

function applyShapeToBoardMatrix() {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0) {
                boardMatrix[i + position.i][j + position.j] = shape[i][j]
            }
        }
    }
}

function resetShape() {
    randomNumber = nextShape
    shape = shapeList[randomNumber]
    nextShape = Math.floor(Math.random() * 7)
    position = {i: -1, j: 3}
    if (position.i++ && isColliding()) {
        musicGameOver()
        $('.game-over').css('display', 'block')
        $('.score-over').text(score)
        clearAll()
    }
}

function isColliding() {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0 && boardMatrix[i + position.i]?.[j + position.j] !== 0) {
                return true
            }
        }
    }
    return false
}

function checkLines() {
    row: for (let i = boardMatrix.length - 1; i >= 0; i--) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            if (boardMatrix[i][j] == 0 || boardMatrix[i][j] == 10) {
                continue row
            }
        }
        let deleteRow = boardMatrix.splice(i, 1)[0].fill(0)
        boardMatrix.unshift(deleteRow)
        i++
        score += 10
        setScore(score)
        musicClearLine()
        if (level == 2 || level == 5) {
            deleteBarrier()
        }
    }
}

//level
function barrier() {
    boardMatrix[7][0] = 10
    boardMatrix[7][1] = 10
    boardMatrix[7][8] = 10
    boardMatrix[7][9] = 10
    boardMatrix[8][0] = 10
    boardMatrix[8][9] = 10
    draw(7, 0, 7)
    draw(7, 1, 7)
    draw(7, 8, 7)
    draw(7, 9, 7)
    draw(8, 0, 7)
    draw(8, 9, 7)
}

function barrier_lv5() {
    boardMatrix[7][4] = 10
    boardMatrix[7][5] = 10
    boardMatrix[8][4] = 10
    boardMatrix[8][5] = 10
    boardMatrix[boardMatrix.length - 1][0] = 10
    boardMatrix[boardMatrix.length - 1][1] = 10
    boardMatrix[boardMatrix.length - 1][2] = 10
    boardMatrix[boardMatrix.length - 1][7] = 10
    boardMatrix[boardMatrix.length - 1][8] = 10
    boardMatrix[boardMatrix.length - 1][9] = 10
    boardMatrix[boardMatrix.length - 2][0] = 10
    boardMatrix[boardMatrix.length - 2][1] = 10
    boardMatrix[boardMatrix.length - 2][8] = 10
    boardMatrix[boardMatrix.length - 2][9] = 10
    boardMatrix[boardMatrix.length - 3][0] = 10
    boardMatrix[boardMatrix.length - 3][9] = 10
    draw(7, 4, 7)
    draw(7, 5, 7)
    draw(8, 4, 7)
    draw(8, 5, 7)
    draw(boardMatrix.length - 1, 0, 7)
    draw(boardMatrix.length - 1, 1, 7)
    draw(boardMatrix.length - 1, 2, 7)
    draw(boardMatrix.length - 1, 7, 7)
    draw(boardMatrix.length - 1, 8, 7)
    draw(boardMatrix.length - 1, 9, 7)
    draw(boardMatrix.length - 2, 0, 7)
    draw(boardMatrix.length - 2, 1, 7)
    draw(boardMatrix.length - 2, 8, 7)
    draw(boardMatrix.length - 2, 9, 7)
    draw(boardMatrix.length - 3, 0, 7)
    draw(boardMatrix.length - 3, 9, 7)

}

function deleteBarrier() {
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            if (boardMatrix[i][j] == 10) {
                boardMatrix[i][j] = 0
            }
        }
    }
    if (level == 2) {
        barrier()
    }
    if (level == 5) {
        barrier_lv5()
    }
}

// level
function deleteLine() {
    let deleteLine = boardMatrix.splice(boardMatrix.length - 1, 1)[0].fill(0)
    boardMatrix.unshift(deleteLine)
}

function speedBoostLine() {
    for (let i = 0; i < boardMatrix[8].length; i++) {
        draw(8, i, 7)
    }
    if (position.i > 7) {
        speedGame = 5
        clearInterval(gameLoop)
        gameLoop = setInterval(function () {
            loop(shape)
        }, speedGame);
    } else {
        speedGame = 700
        clearInterval(gameLoop)
        gameLoop = setInterval(function () {
            loop(shape)
        }, speedGame);
    }
}

function clearAll() {
    clearInterval(gameLoop)
    randomNumber = nextShape
    shape = shapeList[randomNumber]
    nextShape = Math.floor(Math.random() * 7)
    position = {i: -1, j: 3}
    count = 0
    score = 0
    setScore(0)
    musicBackground.pause()
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            boardMatrix[i][j] = 0
            $('.cell.col.cell' + '-' + i + '-' + j).css('background', '#011c31')
        }
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            $('.next.col.next' + '-' + i + '-' + j).css('background', '#011c31')
        }
    }

    if (level == 3)
        clearInterval(loopDeleteLine)
}

document.onkeydown = ev => {
    switch (ev.keyCode) {
        case 40:
            loop(shape)
            musicMove()
            break
        case 37:
            moveLeft()
            position.i--
            loop(shape)
            musicMove()
            break
        case 39:
            moveRight()
            position.i--
            loop(shape)
            musicMove()
            break
        case 38:
            rotate()
            position.i--
            loop(shape)
            musicRotate()
            break
    }
}

function rotateMatrix(shape, clockWise) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < i; j++) {
            [shape[i][j], shape[j][i]] = [shape[j][i], shape[i][j]]
        }
    }
    if (clockWise == 1) {
        shape.forEach(row => {
            row.reverse()
        });
    } else if (clockWise == -1) {
        shape.reverse()
    }
}

function rotate() {
    rotateMatrix(shape, 1)
    if (isColliding()) {
        rotateMatrix(shape, -1)
    }

}

function moveLeft() {
    position.j--
    if (isColliding())
        position.j++

}

function moveRight() {
    position.j++
    if (isColliding())
        position.j--
}
