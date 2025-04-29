class QueueStack {
    #stackPush = [];
    #stackPop = [];

    enqueue(value) {
        this.#stackPush.push(value);
    }

    dequeue() {
        if (this.#stackPop.length === 0) {
            while (this.#stackPush.length > 0) {
                this.#stackPop.push(this.#stackPush.pop());
            }
        }
        return this.#stackPop.pop();
    }

    get_size() {
        return this.#stackPop.length
    }
}

const queue = new QueueStack()
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(40)
for (let i = 0; i < 3; i++) {
    console.log(queue.dequeue());
}

width = 600
height = 600
plotBatchSize = 1000

canvas = null
ctx = null
//xn+1 = sin(a yn) - cos(b xn)
//yn+1 = sin(c xn) - cos(d yn)
let a, b, c, d, x, y
let countMap = [];
let totalCount = 0

const generateConstant = () => {
    // 初期条件をスライダでいじれるなどしたら面白いと少し思った
    // が，スライダで弄れる粒度は粗そうなので，そこは要検討と思われる
    // キモい初期値は即座にデータベースにセーブできる機能をつけておきたい
    // reset ボタンの横に，セーブボタンを置いておきたい
    a = Math.random() * 6 - 3;
    b = Math.random() * 6 - 3;
    c = Math.random() * 6 - 3;
    d = Math.random() * 6 - 3;
    x = 0;
    y = 0;

    for (let i = 0; i < height + 1; i++) {
        countMap[i] = []
        for (let j = 0; j < width + 1; j++) {
            countMap[i][j] = 0
        }
    }

    dispValue('a', a)
    dispValue('b', b)
    dispValue('c', c)
    dispValue('d', d)
}

const dispValue = (c, v) => {
    div = document.createElement('div')
    div.textContent = `${c} = ${v}`
    div.id = `${c}`
    document.body.appendChild(div)
}

const updateDivValue = (c, v) => {
    div = document.getElementById(`${c}`)
    div.textContent = `${c} = ${v}`
}

const step = () => {
    const nx = Math.sin(a * y) - Math.cos(b * x)
    const ny = Math.sin(c * x) - Math.cos(d * y)

    x = nx;
    y = ny;

    a += 0.000001
    b += 0.000001
    c += 0.000002
    d += 0.000005

    const px = Math.floor(((x + 2) / 4) * width)
    const py = Math.floor(((y + 2) / 4) * height)

    countMap[py][px]++
    totalCount++;
    denseLimit = 100000

    queue.enqueue([px, py])

    updateDivValue('a', a)
    updateDivValue('b', b)
    updateDivValue('c', c)
    updateDivValue('d', d)
}

const plot = () => {
    let loopcnt;
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    // まあ，なんでこんな単純そうな関数で，あんなバリエーションのプロットがでてくるのかという，
    // 当たり前すぎる感想を残しておこう

    // 白一色だちょっと寂しいので，いろんな色が出るようにしたいところ
    // 自己相似のある図形も書いていきたい，シェルビンスキーのガスケット？？
    // ローレンツアトラクタなども含まれる
    // ローレンツアトラクタなどは 3d でもいけると思われるので，そっちに組み込むのもアリ
    // （まあそれは普通のカオスでも同じか）
    // 前に借りた，グラフィックスプログラミングや，processing によるジェネラティブ・アートやらも，
    // どんどんパクっていきたいと考えている
    loopcnt = 0
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const ratio = countMap[i][j] / denseLimit * width
            if (ratio) {
                k = 1 - (1 - ratio) ** 100
                ctx.fillStyle = `rgba(255,255,255,${k}`
                ctx.fillRect(j, i, 1, 1)
                //console.log('object');
                loopcnt += 1
            }
        }
    }
    //console.log(loopcnt);
    //console.log(countMap.length);
    //console.log(countMap[0].length);

    const limitOffset = 10000;
    if (totalCount > limitOffset) {
        for (let i = 0; i < plotBatchSize; i++) {
            const a = queue.dequeue()
            console.log(queue.get_size())
            console.log(a[0], a[1]);
            countMap[a[1]][a[0]]--;
        }
    }

}

const init = () => {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    generateConstant()
}

window.onload = async () => {
    init()
    while (true) {
        // どうやらここの更新を 20 以下あたりにすると，重くなっていかれてくるっぽい
        await new Promise(r => setTimeout(r, 250))
        for (let i = 0; i < plotBatchSize; i++) {
            step()
        }
        plot()
    }
}