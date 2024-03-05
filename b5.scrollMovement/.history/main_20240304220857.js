import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
	CameraRig,
	StoryPointsControls,
	WheelAdaptor,
} from 'three-story-controls'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.0001,
	1000
)
const clock = new THREE.Clock()

const scene = new THREE.Scene()
const meshes = {}
const lights = {}

let storyCounter = 0

const storyPoints = [
	{
		meshPosition: new THREE.Vector3(-2, 0, 1),
		color: 0xff0000,
		phi: Math.PI * 0.5,
		theta: 0,
		caption: 'This is a caption about the Green Cube',
	},
	{
		meshPosition: new THREE.Vector3(5, 0, -5),
		color: 0xffff00,
		phi: Math.PI * 0.4,
		theta: Math.PI * 0.5,
		caption: 'This is a caption about the Red Cube',
	},
	{
		meshPosition: new THREE.Vector3(-10, 0, -15),
		color: 0xff00ff,
		phi: Math.PI * 0.3,
		theta: -Math.PI,
		caption: 'This is a caption about the Blue Cube',
	},
]

const cameraPositions = storyPoints.map((item) => {
	const position = new THREE.Vector3()
		.setFromSphericalCoords(15, item.phi, item.theta)
		.add(item.meshPosition)
	const mat = new THREE.Matrix4().lookAt(
		position,
		item.meshPosition,
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
console.log(cameraPositions)
const rig = new CameraRig(camera, scene)
const controls = new StoryPointsControls(rig, cameraPositions, {
	cycle: true,
})
controls.enable()
controls.goToPOI(0)
init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.poi1 = addStandardMesh()
	meshes.poi1.material.color = new THREE.Color(0x00ff00)
	meshes.poi1.position.set(-2, 0, 1)
	meshes.poi2 = addStandardMesh()
	meshes.poi2.position.set(5, 0, -5)
	meshes.poi2.material.color = new THREE.Color(0xff0000)
	meshes.poi3 = addStandardMesh()
	meshes.poi3.position.set(-10, 0, -15)
	meshes.poi3.material.color = new THREE.Color(0x0000ff)
	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.poi1)
	scene.add(meshes.poi2)
	scene.add(meshes.poi3)

	camera.position.set(0, 0, 5)
	const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
	const description = document.querySelector('.captionText')
	wheelAdaptor.connect()
	wheelAdaptor.addEventListener('trigger', (event) => {
		storyCounter++
		if (storyCounter > storyPoints.length) {
			storyCounter = 0
		}
		description.innerHTML = storyPoints[storyCounter].caption
		controls.nextPOI()
	})

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

function animate(t) {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	controls.update(t)

	renderer.render(scene, camera)
}
