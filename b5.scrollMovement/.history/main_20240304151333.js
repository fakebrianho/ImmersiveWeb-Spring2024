import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
//pass in camera and renderer dom element
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
// controls.enablePan = false
// controls.enableZoom = false
const scene = new THREE.Scene()
const meshes = {}
const lights = {}

init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.poi1 = addStandardMesh()
	meshes.poi1.position.set(1, 1, 1)
	meshes.poi2 = addStandardMesh()
	meshes.poi2.position.set(3, 1, 1)
	meshes.poi3 = addStandardMesh()
	meshes.poi3.position.set(5, 1, 1)
	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.poi1)
	scene.add(meshes.poi2)
	scene.add(meshes.poi3)
	scene.add(meshes.default)

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
	const delta = clock.getDelta()
	controls.update()
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01

	renderer.render(scene, camera)
}
