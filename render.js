const renderEvent = new Event('render')

requestAnimationFrame(function render() {
    window.dispatchEvent(renderEvent)
    requestAnimationFrame(render)
})