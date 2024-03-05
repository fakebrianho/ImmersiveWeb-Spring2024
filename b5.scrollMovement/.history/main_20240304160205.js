import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
	CameraRig,
	StoryPointsControls,
	ThreeDOFControls,
	SwipeAdaptor,
} from 'three-story-controls'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.0001,
	1000
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

const storyPoints = [
	{
		meshPosition: new THREE.Vector3(-2, 0, 1),
		color: 0xff0000,
		phi: Math.PI * 0.5,
		theta: 0,
		caption: 'This is a caption about the RED cone',
	},
	{
		meshPosition: new THREE.Vector3(5, 0, -5),
		color: 0xffff00,
		phi: Math.PI * 0.4,
		theta: Math.PI * 0.5,
		caption: 'This is a caption about the YELLOW cone',
	},
	{
		meshPosition: new THREE.Vector3(-10, 0, -15),
		color: 0xff00ff,
		phi: Math.PI * 0.3,
		theta: -Math.PI,
		caption: 'This is a caption about the PINK cone',
	},
]

const cameraPositions = storyPoints.map((item) => {
	const mesh = new THREE.Mesh(
		new THREE.ConeGeometry(3, 10, 4),
		new THREE.MeshPhongMaterial({ color: item.color })
	)
	mesh.position.copy(item.meshPosition)
	// scene.add(mesh)

	const position = new THREE.Vector3()
		.setFromSphericalCoords(15, item.phi, item.theta)
		.add(mesh.position)
	const mat = new THREE.Matrix4().lookAt(
		position,
		mesh.position,
		new THREE.Vector3(0, 1, 0)
	)
	const quaternion = new THREE.Quaternion().setFromRotationMatrix(mat)

	return {
		position,
		quaternion,
		duration: 1,
		useSlerp: true,
	}
})
const rig = new CameraRig(camera, scene)
const controls = new StoryPointsControls(rig, cameraPositions, {
	cycle: true,
})
controls.enable()
controls.goToPOI(0)
const controls3dof = new ThreeDOFControls(rig, {
	panFactor: Math.PI / 10,
	tiltFactor: Math.PI / 10,
	truckFactor: 0,
	pedestalFactor: 0,
})
// controls3dof.enable()

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
	const swipeAdaptor = new SwipeAdaptor()
	swipeAdaptor.connect()
	swipeAdaptor.addEventListener('trigger', (event) => {
		meshes.poi1.scale.y += event.y * 0.1
	})

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

function animate(t) {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	controls.update(t)
	controls3dof.update(delta)

	renderer.render(scene, camera)
}
