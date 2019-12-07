import * as THREE from 'three';
import magicImg from './images/magic.png'
import backImg from './images/back.jpg'
import { PeppersGhostEffect } from 'three/examples/jsm/effects/PeppersGhostEffect'
import * as THREEAR from 'threear'
import pattern from './patt.hiro'
import hiro from './images/hiro.jpg'
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
    while (Math.round(Math.random()));
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
    camera.position.z = window.mode.cameraZ;

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

    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setClearColor(window.mode.clearColor, 0)
    renderer.setPixelRatio(2);
    renderer.sortObjects = false

    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'

    return [renderer, handeleRender, handleResize]
}

export default async function createScene(textures, phrases) {
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
    if (window.mode.background) scene.add(createBackground())

    let effect;
    if (window.mode.ghost) {
        console.log('Creating hologram')
        effect = new PeppersGhostEffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.cameraDistance = 400;
        handleRender = function () {
            effect.render(scene, camera);
        }

        handleRendererResize = function () {
            effect.setSize(window.innerWidth, window.innerHeight);
        }
    }

    if(window.mode.threear){
        group.rotation.x = -Math.PI / 2
        let source = new THREEAR.Source({
				renderer,
				camera,
				// sourceType: "image",
				// sourceUrl: hiro
			});
        let ctl = await	THREEAR.initialize({ source: source, positioning: { smooth: false }  })
        
        let patternGroup = new THREE.Group()
        patternGroup.add(group)
        scene.add(patternGroup)
        
        
        let patternMarker = new THREEAR.PatternMarker({
			patternUrl: pattern,
			markerObject: patternGroup
        });
        
        ctl.trackMarker(patternMarker)

        let handleRenderOld = handleRender
        handleRender = ()=>{
            ctl.update(source.domElement)
            handleRenderOld()
        }


    }

    return {
        scene, camera, blackSphere, sphere, icosahedron, group, renderer,
        handleCameraResize, handleRender, handleRendererResize, setTextures
    }
}
