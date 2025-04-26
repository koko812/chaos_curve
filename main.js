width = 300
height = 300

canvas = null
ctx = null
//xn+1 = sin(a yn) - cos(b xn)
//yn+1 = sin(c xn) - cos(d yn)
let a, b, c, d, x, y
const generateConstant = () => {
    a = Math.random() * 6 - 3;
    b = Math.random() * 6 - 3;
    c = Math.random() * 6 - 3;
    d = Math.random() * 6 - 3;
    x = 0;
    y = 0;

    dispValue('a', a)
    dispValue('b', b)
    dispValue('c', c)
    dispValue('d', d)
}

const dispValue = (c,v) => {
    div = document.createElement('div') 
    div.textContent = `${c} = ${v}`
    document.body.appendChild(div)
}

const step = () => {
    const nx = Math.sin(a * y) - Math.cos(b * x)
    const ny = Math.sin(c * x) - Math.cos(d * y)

    x = nx;
    y = ny;
}

const plot = () => {
    const px = Math.floor(((x + 2) / 4) * width)
    const py = Math.floor(((y + 2) / 4) * height)

    ctx.fillStyle = '#fff'
    ctx.fillRect(px, py, 1, 1)
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
        await new Promise(r => setTimeout(r, 10))
        for (let i = 0; i < 100; i++) {
            step()
            plot()
        }
    }
}