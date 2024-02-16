import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addPhysicalMesh,
	addPhongMaterial,
	addLambertMaterial,
} from './addMeshes'
import { addLight } from './addLights'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
const scene = new THREE.Scene()
const meshes = {}
const lights = {}

init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//stores meshes in our global state
	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	meshes.physical = addPhysicalMesh()
	meshes.phong = addPhongMaterial()
	meshes.lambert = addLambertMaterial()

	//store lights in our global state
	lights.default = addLight()

	//add lights and meshes to our scene
	scene.add(lights.default)
	scene.add(meshes.standard)
	scene.add(meshes.default)
	scene.add(meshes.physical)
	scene.add(meshes.lambert)
	scene.add(meshes.phong)

	camera.position.set(0, 0, 5)
	resize()
	animate()
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
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01
	meshes.physical.rotation.z += 0.01
	meshes.physical.rotation.y -= 0.01

	renderer.render(scene, camera)
}
