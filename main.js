import 'regenerator-runtime/runtime'
import createScene from './createScene';
import getPhrases from './phrases'
import generateImages from './generateImages'
import createAnimator from './animation'
import startToolbox from './toolbox'
import showStats from './render'
import './style.css'

import fullScreenIcon from './images/fullscreen.svg'

window.mode = ({
    '': {
        cameraZ: 250,
        background: true,
        ghost: false,
        clearColor: 0x2222aa,
        threear: false
    },
    '?holo': {
        cameraZ: 0,
        background: false,
        ghost: true,
        clearColor: 0,
        threear: false
    },
    '?ar': {
        cameraZ: 250,
        background: false,
        ghost: false,
        clearColor: 0,
        threear: true
    }
})[location.search]

async function main() {
    console.log('Started loading')

    let phrases = getPhrases();
    console.log('Phrases loaded')

    await generateImages(phrases);
    console.log('Image for phrases generated')

    let scene = await createScene(null, phrases)
    console.log('Scene creates', scene)
    window.s = scene

    scene.handleRendererResize()
    scene.handleCameraResize()
    window.addEventListener('resize', () => scene.handleRendererResize())
    window.addEventListener('resize', () => scene.handleCameraResize())

    scene.handleRender()
    window.addEventListener('render', () => scene.handleRender())

    startToolbox(function () {
        scene.renderer.domElement.requestFullscreen()
    }, function () {
        showStats()
    }, function () {
        location.search = '?holo'
    }, function () {
        location.search = '?ar'
    })
    console.log('Scene created')

    let animator = createAnimator(scene.group, scene.icosahedron, () => scene.setTextures(scene.icosahedron, phrases))
    document.onclick = () => animator()


}

main()