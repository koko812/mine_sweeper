// まず，論理ボードを作ります
const width = 10
const height = 10
const size = 30
const mineCount = 5

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
            div.style.fontSize = `${size * 0.6}px`
            div.style.display = 'flex'
            div.style.justifyContent = 'center'
            div.style.alignItems = 'center'
            //div.textContent = '1'
            container.appendChild(div)
            board[y][x].element = div
            div.onpointerdown = (e) => {
                e.preventDefault()
                open(x, y)
            }
        }
    }
}

const update = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = board[y][x]
            if (cell.open) {
                // #000 は黒くなりすぎ，元と同じ色だと，押した感が出てこない
                cell.element.textContent = cell.text
                cell.element.style.border = '1px solid #aaa'
            }
        }
    }
}

const open = (x, y) => {
    const cell = board[y][x]
    console.log(x,y);
    // 元から cell が空いている場合の処理を書き忘れていた
    if (cell.open) {
        return
    }
    cell.open = true

    // これできれば全部の爆弾を爆発させたいかもしれない
    if (cell.mine) {
        cell.text = '💥'
        update()
        return
    }

    let counter = 0
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            // 書き方が微妙すぎた
            //const cell = board[y+dy][x+dx]
            //if(cell.mine){
            //    counter++
            //}
            const cx = x + dx
            const cy = y + dy
            if (cx < 0 || cx > width || cy < 0 || cy > height) {
                continue
            }
            if (board[cy][cx].mine) {
                counter++
            }
        }
    }

    if (counter) {
        cell.text = counter
    }
    update()
}

window.onload = () => {
    init()
}