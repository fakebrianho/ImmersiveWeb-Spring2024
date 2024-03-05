import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
	CameraRig,
	StoryPointsControls,
	ThreeDOFControls,
} from 'three-story-controls'

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

const storyPoints = [
	{
		meshPosition: new Vector3(0, 0, -30),
		color: 0xff0000,
		phi: Math.PI * 0.5,
		theta: 0,
		caption: 'This is a caption about the RED cone',
	},
	{
		meshPosition: new Vector3(20, 0, -45),
		color: 0xffff00,
		phi: Math.PI * 0.4,
		theta: Math.PI * 0.5,
		caption: 'This is a caption about the YELLOW cone',
	},
	{
		meshPosition: new Vector3(45, 0, 0),
		color: 0xff00ff,
		phi: Math.PI * 0.3,
		theta: -Math.PI,
		caption: 'This is a caption about the PINK cone',
	},
]

init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.poi1 = addStandardMesh()
	meshes.poi1.position.set(-2, 0, 1)
	meshes.poi2 = addStandardMesh()
	meshes.poi2.position.set(5, 0, -5)
	meshes.poi3 = addStandardMesh()
	meshes.poi3.position.set(-10, 0, -15)
	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.poi1)
	scene.add(meshes.poi2)
	scene.add(meshes.poi3)

	camera.position.set(0, 0, 5)
	resize()
	animate()
}

function cameraRigging() {
	//a
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

	renderer.render(scene, camera)
}
