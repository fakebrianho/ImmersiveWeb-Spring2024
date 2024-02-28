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
const scene = new THREE.Scene()
const meshes = {}
const lights = {}

let video

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

	webcam()
	resize()
	animate()
}

function webcam() {
	video = document.getElementById('video')

	const texture = new THREE.VideoTexture(video)
	texture.colorSpace = THREE.SRGBColorSpace

	const geometry = new THREE.PlaneGeometry(16, 9)
	geometry.scale(0.5, 0.5, 0.5)
	const material = new THREE.MeshBasicMaterial({ map: texture })
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		const constraints = {
			video: { width: 1280, height: 720, facingMode: 'user' },
		}

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(function (stream) {
				// apply the stream to the video element used in the texture

				video.srcObject = stream
				video.play()
			})
			.catch(function (error) {
				console.error('Unable to access the camera/webcam.', error)
			})
	} else {
		console.error('MediaDevices interface not available.')
	}
	const mesh = new THREE.Mesh(geometry, material)
	meshes.camTexture = mesh
	scene.add(meshes.camTexture)
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
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01

	renderer.render(scene, camera)
}
