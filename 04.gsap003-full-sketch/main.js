// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight, ambient, mouseLight, hemi } from './addLights'
import gsap from 'gsap'
import Clickable from './Clickable'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { post } from './postprocess'

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	stencil: false,
	// depth: false,
	powerPreference: 'high-performance',
})

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = false
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.1
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const mixers = []
const meshes = {}
const lights = {}
const interactable = []
const defaultPosition = new THREE.Vector3(2.8, 1.4, 3.7)
const composer = post(camera, renderer, scene)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	lights.default = addLight()
	lights.ambient = ambient()
	lights.hemisphere = hemi()

	scene.add(lights.default)
	scene.add(lights.ambient)
	scene.add(lights.hemisphere)

	camera.position.set(2.8, 1.4, 3.7)
	camera.rotation.set(-0.4, 0.6, 0.23)
	instances()
	raycast()
	resize()
	animate()
}

function instances() {
	const room = new Model({
		//mandataory
		url: '/bedroom.glb',
		scene: scene,
		meshes: meshes,
		//optional
		callback: loader,
		animationState: false,
		mixers: mixers,
		replace: false,
		replaceURL: '/mat.png',
		particleURL: '1.png',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(8.813, -1.0, 0),
	})
	room.init()
	// room.initPoints()
	const clickable1 = new Clickable({
		scene: scene,
		lights: lights,
		name: 'Button1',
		position: new THREE.Vector3(-0.78, 0.8, 0.85),
		lookPosition: new THREE.Vector3(1, 0.5, 2),
		container: interactable,
	})
	clickable1.init()
	const clickable2 = new Clickable({
		scene: scene,
		lights: lights,
		name: 'Button2',
		position: new THREE.Vector3(1.35, 0.8, -1.6),
		lookPosition: new THREE.Vector3(0.3, 0.5, 0.5),
		container: interactable,
	})
	clickable2.init()
	const clickable3 = new Clickable({
		scene: scene,
		lights: lights,
		name: 'Button3',
		position: new THREE.Vector3(0.0, 0.25, -1.2),
		lookPosition: new THREE.Vector3(1, 0.5, 0),
		container: interactable,
	})
	clickable3.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(interactable)
		for (let i = 0; i < intersects.length; i++) {
			turnOffLights()
			intersects[i].object.parent.intensity = 0.5
			const targetPos = intersects[i].object.parent.position
			const cameraTarget = intersects[i].object.parent.userData.lookAt
			if (intersects[i].object.parent.userData.active) {
				turnOffLights()
				moveControls({
					x: 0,
					y: 0,
					z: 0,
				})
				moveCamera({
					x: defaultPosition.x,
					y: defaultPosition.y,
					z: defaultPosition.z,
				})
			} else {
				lightSoundFX()
				moveControls({
					x: targetPos.x,
					y: targetPos.y - 0.4,
					z: targetPos.z,
				})
				moveCamera({
					x: cameraTarget.x,
					y: cameraTarget.y,
					z: cameraTarget.z,
				})
			}
			intersects[i].object.parent.userData.active =
				!intersects[i].object.parent.userData.active
		}
	})
}
function moveControls({ x, y, z }) {
	gsap.to(controls.target, {
		x: x,
		y: y,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
	})
}
function moveCamera({ x, y, z }) {
	gsap.to(camera.position, {
		x: x,
		y: y,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
	})
}

// function loadingCallback() {
// 	const audio = document.querySelector('.introAudio')
// 	audio.play()
// 	controls.enabled = true
// 	//
// }

function lightSoundFX() {
	const audio = document.querySelector('.light')
	audio.play()
}

function loader() {
	const spinner = document.querySelector('.lds-circle')
	const enter = document.querySelector('.enterButton')
	const loader = document.querySelector('.loader')
	enter.addEventListener('click', () => {
		gsap.to(loader, {
			autoAlpha: 0,
			duration: 5,
			onComplete: () => {
				loader.style.display = 'none'
			},
		})
		const audio = document.querySelector('.introAudio')
		audio.play()
		controls.enabled = true
	})
	gsap.to(spinner, {
		autoAlpha: 0,
		duration: 3,
	})
	gsap.to(enter, {
		opacity: 1,
		duration: 4,
		delay: 2.0,
	})
}

function turnOffLights() {
	for (const light in lights) {
		if (lights[light] instanceof THREE.PointLight) {
			lights[light].intensity = 0
		}
	}
}

function animate() {
	controls.update()
	requestAnimationFrame(animate)
	composer.render()
}
