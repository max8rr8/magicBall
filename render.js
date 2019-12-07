import Stats from 'stats.js'

let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

const renderEvent = new Event('render')

requestAnimationFrame(function render() {
    stats.begin()
    window.dispatchEvent(renderEvent)
    stats.end()
    requestAnimationFrame(render)
})

export default function() {
    document.body.appendChild( stats.dom );
}