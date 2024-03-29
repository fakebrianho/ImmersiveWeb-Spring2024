import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import gsap from 'gsap'

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
//pass in camera and renderer dom element
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const meshes = {}
const lights = {}
const objectDistance = 50
const sectionMeshes = []
const listener = new THREE.AudioListener()
camera.add(listener)
const sound1 = new THREE.PositionalAudio(listener)
const sound2 = new THREE.PositionalAudio(listener)
const sound3 = new THREE.PositionalAudio(listener)
const audioLoader = new THREE.AudioLoader()
audioLoader.load('/1.mp3', function (buffer) {
	sound1.setBuffer(buffer)
	sound1.setRefDistance(20)
	sound1.setRolloffFactor(100)
	sound1.setMaxDistance(200)
	sound1.setDistanceModel('linear')
	// sound1.play()
})
audioLoader.load('/2.mp3', function (buffer) {
	sound2.setBuffer(buffer)
	sound2.setRefDistance(20)
	sound2.setRolloffFactor(100)
	sound2.setMaxDistance(200)
	sound2.setDistanceModel('linear')
	// sound2.play()
})
audioLoader.load('/3.mp3', function (buffer) {
	sound3.setBuffer(buffer)
	sound3.setRolloffFactor(50)
	sound3.setRefDistance(20)
	sound3.setMaxDistance(200)
	sound3.setDistanceModel('linear')
	// sound3.play()
})
let scrollY = window.scrollY
let currentSection = 0

init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
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
	meshes.standard2.add(sound2)
	meshes.standard3.add(sound3)
	sectionMeshes.push(meshes.standard)
	sectionMeshes.push(meshes.standard2)
	sectionMeshes.push(meshes.standard3)

	scene.add(lights.default)
	scene.add(meshes.standard)
	scene.add(meshes.standard2)
	scene.add(meshes.standard3)
	// scene.add(meshes.default)

	camera.position.set(0, 0, 5)
	window.addEventListener('click', () => {
		sound1.play()
		sound2.play()
		sound3.play()
	})
	initScrolling()
	resize()
	animate()
}

function initScrolling() {
	window.addEventListener('scroll', () => {
		scrollY = window.scrollY
		const section = Math.round(scrollY / window.innerHeight)

		if (section != currentSection) {
			currentSection = section
			gsap.to(sectionMeshes[section].rotation, {
				duration: 1.5,
				ease: 'power3.inOut',
				x: '+=6',
				y: '+=3',
			})
		}
	})
}
function updateVolumeBasedOnDistance(
	audioSource,
	listenerPosition,
	maxDistance,
	rolloffFactor = 1
) {
	const audioPosition = new THREE.Vector3()
	audioSource.getWorldPosition(audioPosition)
	const distance = audioPosition.distanceTo(listenerPosition)

	let volume = 1.0
	if (distance > maxDistance) {
		// volume = 0 // Beyond max distance, volume is 0.
		volume = (0 - volume) * 0.01
	} else {
		// Example of a simple linear rolloff model. You might want to use a more
		// complex formula depending on your needs (e.g., exponential).
		const volumeDropOff = distance / maxDistance
		volume = Math.max(0, 1 - volumeDropOff * rolloffFactor)
	}

	audioSource.setVolume(volume)
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
