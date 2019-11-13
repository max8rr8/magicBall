import 'regenerator-runtime/runtime'
import createScene from './createScene';
import getPhrases from './phrases'
import getTextures from './images'
import generateImages from './generateImages'
import createAnimator from './animation'
import './render'

async function main() {
    console.log('Started loading')
    
    let phrases = getPhrases();
    let textures = getTextures();
    console.log('Static content loaded')

    await generateImages(phrases);
    console.log('Image for phrases generated')

    let scene = createScene(textures, phrases)
    console.log('Scene creates', scene)
    window.s = scene

    scene.handleRendererResize()
    scene.handleCameraResize()
    window.addEventListener('resize', ()=> scene.handleRendererResize())
    window.addEventListener('resize', ()=> scene.handleCameraResize())

    scene.handleRender()
    window.addEventListener('render', () => scene.handleRender())

    console.log('Scene created')

    let animator = createAnimator(scene.group, scene.icosahedron, ()=>scene.setTextures(scene.icosahedron, phrases))
    document.onclick = ()=>animator()
}

main()