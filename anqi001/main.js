import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './Model'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.01,
	1000
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
const mixers = []

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
	scene.add(meshes.default)

	camera.position.set(0, 0, 5)
	instances()
	resize()
	animate()
}

// your 3d model is just super off scaled / off the 0,0,0 in blender so you have to offset it a lot to see the model
function instances() {
	const blackhole = new Model({
		url: './warpspeed.glb',
		scene: scene,
		meshes: meshes,
		name: 'blackhole',
		mixers: mixers,
		animationState: true,
		position: new THREE.Vector3(0, -122.45, -514.75),
		scale: new THREE.Vector3(3.0, 3.0, 3.0),
	})
	blackhole.init()
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
	for (const mixer of mixers) {
		mixer.update(delta)
	}
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01

	renderer.render(scene, camera)
}
