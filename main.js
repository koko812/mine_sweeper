// まず，論理ボードを作ります
const width = 10
const height = 10
const size = 30
const mineCount = 3

const board = []
for (let y = 0; y < height; y++) {
    board[y] = []
    for (let x = 0; x < width; x++) {
        board[y][x] = {
            text: ''
        }
    }
}

for (let i = 0; i < mineCount; i++) {
    let x, y;
    // do while を初めて使いました，スマートな書き方で素晴らしいね
    do {
        x = Math.trunc(Math.random() * width)
        y = Math.trunc(Math.random() * height)
    } while (board[y][x].mine)
    board[y][x].mine = true
}

const init = () => {
    const container = document.getElementById('container')
    container.style.width = `${size * width}px`
    container.style.height = `${size * height}px`

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const div = document.createElement('div')
            div.style.position = 'absolute'
            div.style.width = `${size}px`
            div.style.height = `${size}px`
            div.style.top = `${size * y}px`
            div.style.left = `${size * x}px`
            // 普段は bgcolor の方が暗くしているけど，今回は浮き出させたいので，逆にしている
            div.style.backgroundColor = `#ccc`
            div.style.border = `3px outset #eee`
            div.style.boxSizing = 'border-box'
            container.appendChild(div)
        }
    }
}

window.onload = () => {
    init()
}