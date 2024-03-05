import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.dampingFactor = 0.08
// controls.enablePan = false
// controls.enableZoom = false
const scene = new THREE.Scene()
const meshes = {}
const lights = {}
const objectDistance = 5
const sectionMeshes = []
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
	sectionMeshes.push(meshes.standard)
	sectionMeshes.push(meshes.standard2)
	sectionMeshes.push(meshes.standard3)

	scene.add(lights.default)
	scene.add(meshes.standard)
	scene.add(meshes.standard2)
	scene.add(meshes.standard3)
	// scene.add(meshes.default)

	camera.position.set(0, 0, 5)
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
			console.log('changed')
			gsap.to(sectionMeshes[section].rotation, {
				duration: 1.5,
				ease: 'power3.inOut',
				x: '+=6',
				y: '+=3',
			})
		}
		console.log(Math.round(scrollY / window.innerHeight))
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
	// console.log(camera.position)

	for (const mesh of sectionMeshes) {
		mesh.rotation.x += delta * 0.1
		mesh.rotation.y += delta * 0.12
	}

	renderer.render(scene, camera)
}