import * as THREE from 'three';
import magicImg from './magic.png'
import backImg from './back.jpg'

const textureLoader = new THREE.TextureLoader()

function createSphere(r, m) {
    var geometry = new THREE.SphereGeometry(r, 32, 32);
    var material = new THREE.MeshPhongMaterial({ map: m, transparent: true, opacity: 1 });
    material.transparent = true;
    material.magFilter = THREE.NearestFilter
    var sphere = new THREE.Mesh(geometry, material);
    return sphere;
}

function createBlackSphere(r) {
    var geometry = new THREE.SphereGeometry(r, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.BackSide });
    material.transparent = true;
    var sphere = new THREE.Mesh(geometry, material);
    return sphere;
}

function setTextures(icosahedron, phrases) {
    while(Math.round(Math.random()));
    icosahedron.material = phrases.sort(() => Math.random() - 0.5).map(e => e.texture)
}

function createIcosahedron(phrases) {
    var geometry = new THREE.IcosahedronGeometry(60);
    geometry.faceVertexUvs[0] = []
    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1)
        ])

        geometry.faces[i].materialIndex = i
    }

    var material = new THREE.MeshPhongMaterial({ color: 0x2222ff })

    var icosahedron = new THREE.Mesh(geometry, material);
    icosahedron.rotation.set(0.35, -3.08, -1.55)
    setTextures(icosahedron, phrases)

    return [icosahedron, setTextures]
}

function createDirLight(x, y, z) {
    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(x, y, z);

    return dirLight
}

function createBackground() {
    var planeGeom = new THREE.PlaneGeometry(900, 600, 32);
    var planeMat = new THREE.MeshPhongMaterial({ map: textureLoader.load(backImg), transparent: true, opacity: 1 });
    var plane = new THREE.Mesh(planeGeom, planeMat);

    return plane
}

function createCamera() {
    var camera;

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    return [camera, handleResize]
}

function createRenderer(camera, scene) {
    var renderer;

    function handleResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log()
    }

    function handeleRender() {
        renderer.render(scene, camera);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000066)
    renderer.setPixelRatio(2);
    renderer.sortObjects = false

    document.body.appendChild(renderer.domElement);

    return [renderer, handeleRender, handleResize]
}

export default function createScene(textures, phrases) {
    var scene = new THREE.Scene(),
        [camera, handleCameraResize] = createCamera(),
        blackSphere = createBlackSphere(107),
        sphere = createSphere(110, textureLoader.load(magicImg)),
        [icosahedron, setTextures] = createIcosahedron(phrases),
        group = new THREE.Group(),
        [renderer, handleRender, handleRendererResize] = createRenderer(camera, scene)

    group.add(blackSphere)
    group.add(icosahedron)
    group.add(sphere)
    scene.add(group)

    scene.add(new THREE.AmbientLight(0xffffff))
    scene.add(createDirLight(100, 100, 0))
    scene.add(createDirLight(0, 0, 0))
    scene.add(createBackground())

    return {
        scene, camera, blackSphere, sphere, icosahedron, group, renderer,
        handleCameraResize, handleRender, handleRendererResize, setTextures
    }
}
