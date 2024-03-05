import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import gsap from 'gsap'

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
//pass in camera and renderer dom element
const container = document.querySelector('.container')
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const meshes = {}
const lights = {}
const objectDistance = 12
const sectionMeshes = []

let scrollY = 0
let currentSection = 0

const transforms = [
	{ positionX: 2, positionY: 0, rotation: Math.PI * 3 },
	{ positionX: -2, positionY: objectDistance, rotation: Math.PI },
	{ positionX: 2, positionY: objectDistance * 2, rotation: Math.PI * 2 },
	{ positionX: -2, positionY: objectDistance * 3, rotation: Math.PI * 5 },
	{ positionX: 2, positionY: objectDistance * 4, rotation: Math.PI * 4 },
]

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.standard)
	camera.position.set(0, 0, 5)

	initScrolling()
	resize()
	animate()
}

function initScrolling() {
	container.addEventListener('scroll', () => {
		scrollY = container.scrollTop
		const section = Math.round(scrollY / window.innerHeight)
		if (section != currentSection) {
			currentSection = section
			gsap.to(meshes.standard.rotation, {
				z: transforms[section].rotation,
				duration: 1,
				ease: 'power2.inOut',
			})
			gsap.to(meshes.standard.position, {
				x: transforms[section].positionX,
				duration: 1,
				ease: 'power2.inOut',
			})
		}
	})
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	// camera.position.y = (-scrollY / window.innerHeight) * objectDistance
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	const elapsedTime = clock.getElapsedTime()
	// controls.update()
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01

	const listenerPosition = new THREE.Vector3()
	camera.getWorldPosition(listenerPosition)

	// Assuming sound1 is your PositionalAudio object
	// updateVolumeBasedOnDistance(sound1, listenerPosition, 20, 0.5)
	// updateVolumeBasedOnDistance(sound2, listenerPosition, 20, 0.5)
	// updateVolumeBasedOnDistance(sound3, listenerPosition, 20, 0.5)

	renderer.render(scene, camera)
}
