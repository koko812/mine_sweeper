// ゲームクリアの演出として，全面金色になるとかいう演出とかいいかも
// 左上から順番に塗りつぶしていくみたいなアニメーションがあればより面白いかも
// 多分 transition じゃ対応できないので，そこは setTimeout するしかないよね
// transition で対応できるのはアフィン変換だけ（のはず

// できれば，最初一発目は爆発しないようにしたい
// なんにせよ，もうちょっとオリジナル要素をつけたいように思う（簡単に実装できたので）；

// まず，論理ボードを作ります
const width = 10
const height = 10
const size = 30
// これね，普通にボードちっちゃくして mine 増やせばそれっぽくなるって，
// なぜ気づかなかったのだ，一気にマスを開ける時の動作確認しようとした時の話
const mineCount = 8
let leftCount = 0

let gameOver = false

const board = []
for (let y = 0; y < height; y++) {
    board[y] = []
    for (let x = 0; x < width; x++) {
        leftCount++
        board[y][x] = {
            text: '',
            mine: false
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
    leftCount--
}

const openTargetList = []
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
                if (gameOver) {
                    return
                }
                if (document.getElementById('flag').checked) {
                    console.log('flag');
                    flag(x, y)
                } else {
                    openTargetList.push([x, y])
                    open()
                }
            }
        }
    }
}

// さらっとかけた
// ただ，押されてないボタン上にテキストを設定できるようにしてなかったので，
// そこの修正（一行だけ）は必要だった
const flag = (x, y) => {
    const cell = board[y][x]
    if (cell.open) {
        return
    }
    if (cell.text === '🚩') {
        cell.text = ''
    } else {
        //console.log('flagg!!');
        cell.text = '🚩'
    }
    update()
}

// さらっとかけた
const showAllMine = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = board[y][x]
            if (cell.mine) {
                cell.text = '💣'
            }
        }
    }
}

const update = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = board[y][x]
            // これが下の if 文の内側に入っていたので，ハタが出てこなかった
            cell.element.textContent = cell.text
            if (cell.open) {
                // #000 は黒くなりすぎ，元と同じ色だと，押した感が出てこない
                // 爆弾の数によって，テキストの色を変えていたのは，昔やったマインスイーパー
                console.log(cell.text);
                cell.element.style.border = '1px solid #aaa'
            }
        }
    }
}

// 周りに地雷があるものも open していくと，全部開いてしまう
// ここの処理が，完全に理解できている感じがしなくて怖い
const open = () => {
    while (openTargetList.length) {
        [x, y] = openTargetList.pop()
        const cell = board[y][x]
        //console.log(x, y);
        // 元から cell が空いている場合の処理を書き忘れていた
        if (cell.open) {
            // continue にしないと，空いてるところで勝手にとまる
            continue
        }
        cell.open = true
        leftCount--

        // これできれば全部の爆弾を爆発させたいかもしれない
        if (cell.mine) {
            cell.text = '💥'
            gameOver = true
            showAllMine()
            update()
            continue
        }

        let counter = 0

        const target = []
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                // 書き方が微妙すぎた
                //const cell = board[y+dy][x+dx]
                //if(cell.mine){
                //    counter++
                //}
                const cx = x + dx
                const cy = y + dy
                console.log(cx, cy);
                // >= にしないと，配列オーバーするので注意
                // 番兵を使わない場合の実装ってことだな
                if (cx < 0 || cx >= width || cy < 0 || cy >= height) {
                    continue
                }
                if (board[cy][cx].mine) {
                    counter++
                }
                // 二重でターゲットリストを作る感じが，自分には閃かなかった
                target.push([cx, cy])
            }
        }

        if (counter) {
            cell.text = counter
        } else {
            cell.text = ''
            openTargetList.push(...target)
        }
        // マインスイーパーはターン制ゲームなので，while ループでリアルタイムでは更新しないと言うわけ
        if (!leftCount) {
            showAllMine()
            gameOver = true
        }
    }
    update()
}

window.onload = () => {
    init()
    const startTime = Date.now()
    const tick = () => {
        if (gameOver) {
            return
        }
        const time = Date.now() - startTime
        // 状況設定的に，カウントダウンでもいいかもね，爆弾解除的なシナリオで
        document.getElementById('timer').textContent = (time / 1000).toFixed(2)
        requestAnimationFrame(tick)
    }
    //tick を使わないと当然 timer は表示されないぞ！
    tick()
}