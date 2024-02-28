import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollSnap } from './scroll-snap'

const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: canvas,
	alpha: true,
})
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

//pass in camera and renderer dom element
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const meshes = {}
const lights = {}

//Lenis
const lenis = new Lenis({
	wrapper: document.getElementById('wrapper-mandatory'),
	content: document.getElementById('root-mandatory'),
	lerp: 1.0,
})
let currentSection = 0
new ScrollSnap(lenis, { snapType: 'proximity' })
// window.lenis = lenis
init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.standard)
	// meshes.standard.position.set(-2, 0, 0)
	camera.position.set(0, 0, 5)
	initLenis()
	resize()
	animate()
}

const transforms = [
	{ positionX: 2, rotation: Math.PI * 3 },
	{ positionX: -2, rotation: Math.PI },
	{ positionX: 2, rotation: Math.PI * 2 },
	{ positionX: -2, rotation: Math.PI * 5 },
	{ positionX: 2, rotation: Math.PI * 4 },
]

function initLenis() {
	meshes.standard.rotation.x = lenis.progress * 20
	// lenis.scrollTo(document.querySelector('#test'), { lerp: 0.01 })
	lenis.on('scroll', (e) => {
		const newSection = Math.round(e.animatedScroll / sizes.height)
		if (newSection != currentSection) {
			currentSection = newSection
			gsap.to(meshes.standard.rotation, {
				z: transforms[newSection].rotation,
				duration: 1,
				ease: 'power2.inOut',
			})
			gsap.to(meshes.standard.position, {
				x: transforms[newSection].positionX,
				duration: 1,
				ease: 'power2.inOut',
			})
		}
		meshes.standard.rotation.x = lenis.progress * 20
	})
	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	// controls.update()
	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.y -= 0.01
	// meshes.standard.rotation.x -= 0.01
	// meshes.standard.rotation.z -= 0.01

	renderer.render(scene, camera)
}
