function animate(change, time) {
    const start = performance.now()
    const getMoment = () => (performance.now() - start) / time

    return new Promise((resolve) => {
        function onRender() {
            const moment = getMoment()

            if (moment < 1) {
                change(moment)
            } else {
                change(1)
                window.removeEventListener('render', onRender)
                resolve()
            }
        }

        window.addEventListener('render', onRender)
    })

}

function createIcosahedronAnimation(icosahedron, setTextures) {
    return async (isLong) => {
        await animate(dat => {
            icosahedron.rotation.x += (Math.random() - 0.1) / 10
            icosahedron.rotation.y += (Math.random() - 0.1) / 10
            icosahedron.rotation.z += (Math.random() - 0.1) / 10
        }, isLong ? 1500 : 250)

        let startX = icosahedron.rotation.x;
        let startY = icosahedron.rotation.y;
        let startZ = icosahedron.rotation.z;

        setTextures(icosahedron)

        let coffX = 0.35 - icosahedron.rotation.x;
        let coffY = -3.08 - icosahedron.rotation.y;
        let coffZ = -1.55 - icosahedron.rotation.z;

        await animate(dat => {
            icosahedron.rotation.x = startX + coffX * Math.sin(dat * Math.PI / 2)
            icosahedron.rotation.y = startY + coffY * Math.sin(dat * Math.PI / 2)
            icosahedron.rotation.z = startZ + coffZ * Math.sin(dat * Math.PI / 2)
        }, 750)

        
        icosahedron.rotation.set(0.35, -3.08, -1.55)
    }
}

function createDragAnimation(group) {
    return async () => {
        await animate(dat => {
            group.position.x = -10 * dat
            group.position.y = -10 * dat
        }, 125)

        await animate(dat => {
            group.position.x = -10 * (1 - dat)
            group.position.y = -10 * (1 - dat)
        }, 125)
    }
}

export default function createAnimator(group, icosahedron, setTextures) {
    let animateIcosahedron = createIcosahedronAnimation(icosahedron, setTextures)
    let drag = createDragAnimation(group)
    let animating = false
    return async () => {
        if(animating) return;
        animating = true;
        animateIcosahedron(Math.round(group.rotation.y) == 3)

        if (Math.round(group.rotation.y) == 3) {
            await animate(dat => {
                group.rotation.y = Math.PI * (1 + dat)
            }, 750)
        }

        await drag()
        await drag()

        await animate(dat => {
            group.rotation.y = Math.PI * dat
        }, 750)
        animating = false
    }
}