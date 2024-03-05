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
const listener = new THREE.AudioListener()
camera.add(listener)
const sound1 = new THREE.PositionalAudio(listener)
const sound2 = new THREE.PositionalAudio(listener)
const sound3 = new THREE.PositionalAudio(listener)
const audioLoader = new THREE.AudioLoader()

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
	meshes.standard2 = addStandardMesh()
	meshes.standard3 = addStandardMesh()
	lights.default = addLight()
	meshes.standard.position.y = objectDistance * 0
	meshes.standard2.position.y = -objectDistance * 1
	meshes.standard3.position.y = -objectDistance * 2
	meshes.standard.add(sound1)
	// meshes.standard2.add(sound2)
	// meshes.standard3.add(sound3)
	// sectionMeshes.push(meshes.standard)
	// sectionMeshes.push(meshes.standard2)
	// sectionMeshes.push(meshes.standard3)

	scene.add(lights.default)
	scene.add(meshes.standard)
	// scene.add(meshes.standard2)
	// scene.add(meshes.standard3)
	// scene.add(meshes.default)

	camera.position.set(0, 0, 5)
	window.addEventListener('click', () => {
		sound1.play()
		sound2.play()
		sound3.play()
	})
	// initAudio()
	initScrolling()
	resize()
	animate()
}

function initAudio() {
	audioLoader.load('/1.mp3', function (buffer) {
		sound1.setBuffer(buffer)
		sound1.setRefDistance(3)
		sound1.setRolloffFactor(5)
		sound1.setMaxDistance(20)
		sound1.setDistanceModel('exponential')
	})
	audioLoader.load('/2.mp3', function (buffer) {
		sound2.setBuffer(buffer)
		sound2.setRefDistance(3)
		sound2.setRolloffFactor(5)
		sound2.setMaxDistance(20)
		sound2.setDistanceModel('exponential')
	})
	audioLoader.load('/3.mp3', function (buffer) {
		sound3.setBuffer(buffer)
		sound3.setRefDistance(3)
		sound3.setRolloffFactor(5)
		sound3.setMaxDistance(20)
		sound3.setDistanceModel('exponential')
	})
}
function initScrolling() {
	container.addEventListener('scroll', () => {
		console.log(container.scrollTop)
		scrollY = 0
		// scrollY = container.scrollTop
		// const section = Math.round(scrollY / window.innerHeight)
		// if (section != currentSection) {
		// currentSection = section
		// gsap.to(meshes.standard.rotation, {
		// 	z: transforms[section].rotation,
		// 	duration: 1,
		// 	ease: 'power2.inOut',
		// })
		// gsap.to(meshes.standard.position, {
		// 	x: transforms[section].positionX,
		// 	duration: 1,
		// 	ease: 'power2.inOut',
		// })
		// }
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
	camera.position.y = (-scrollY / window.innerHeight) * objectDistance
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	const elapsedTime = clock.getElapsedTime()
	// controls.update()
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	// meshes.standard.rotation.x -= 0.01
	// meshes.standard.rotation.z -= 0.01

	for (const mesh of sectionMeshes) {
		mesh.rotation.x += delta * 0.1
		mesh.rotation.y += delta * 0.12
	}
	const listenerPosition = new THREE.Vector3()
	camera.getWorldPosition(listenerPosition)

	// Assuming sound1 is your PositionalAudio object
	// updateVolumeBasedOnDistance(sound1, listenerPosition, 20, 0.5)
	// updateVolumeBasedOnDistance(sound2, listenerPosition, 20, 0.5)
	// updateVolumeBasedOnDistance(sound3, listenerPosition, 20, 0.5)

	renderer.render(scene, camera)
}
