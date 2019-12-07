import * as THREE from 'three'
import * as WebFont from 'webfontloader'

const loader = new THREE.TextureLoader()

function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
    var words = text.split(" ");
    var countWords = words.length;
    var line = "";
    for (var n = 0; n < countWords; n++) {
        var testLine = line + words[n] + " ";
        var testWidth = context.measureText(testLine).width;
        if (testWidth > (120 - marginTop)) {

            if (line.trim() == '') marginTop -= lineHeight
            context.fillText(line, marginLeft, marginTop);
            line = words[n] + " ";
            marginTop += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, marginLeft, marginTop);
}

function generateImage(e) {
    let m = document.createElement('canvas')
    m.height = 960
    m.width = 960
    let ctx = m.getContext('2d')
    ctx.font = '26px Jolly Lodger'
    ctx.translate(960, 0)
    ctx.scale(-6, 6)

    ctx.fillStyle = '#2222aa'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(160, 0)
    ctx.lineTo(160, 160)
    ctx.lineTo(0, 160)
    ctx.lineTo(0, 0)
    ctx.fill()

    ctx.translate(10, 0)

    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'right'
    console.log(e)
    wrapText(ctx, e.phrase, 130, 12, 150, 30)
    // document.body.appendChild(m)
    e.image = m.toDataURL()
    let rr = document.createElement('img')
    rr.src = e.image
    document.addEventListener('showimage', e => {
        document.body.appendChild(rr)
        document.body.style.overflow = 'visible'
        document.html.style.overflow = 'visible'
    }, 100)

    let tex = new THREE.MeshPhongMaterial({ map: loader.load(e.image), transparent: true, opacity: 1 })
    tex.magFilter = THREE.NearestFilter
    e.texture = tex
}

export default function generateImages(phrases) {
    return new Promise(res => {
        WebFont.load({
            google: {
                families: ['Jolly Lodger', 'Open Sans']
            },
            active: function () {
                phrases.forEach(e => generateImage(e))
                res()
            }
        });
    })
}