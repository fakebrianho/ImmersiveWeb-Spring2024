import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import gsap from 'gsap'
import Model from './Model'

const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
const scene = new THREE.Scene()
const meshes = {}
const lights = {}
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

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
	raycast()
	animate()
}

function instances() {
	const heart = new Model({
		name: 'heart',
		scene: scene,
		meshes: meshes,
		url: '/heart.glb',
		clickable: true,
	})
	heart.init()
}

function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children)
		console.log(intersects)
		for (let i = 0; i < intersects.length; i++) {
			if (intersects[i].object.userData.name == 'heart') {
				gsap.to(intersects[i].object.scale, {
					x: 2,
					y: 2,
					z: 2,
					duration: 2,
					ease: 'power3.inOut',
				})
			}
			if (intersects[i].object.userData.name == 'target2') {
				gsap.to(intersects[i].object.scale, {
					x: 0.5,
					y: 0.5,
					z: 0.5,
					duration: 2,
					ease: 'power3.inOut',
				})
			}
		}
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
	requestAnimationFrame(animate)
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01

	renderer.render(scene, camera)
}
