import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { post } from './Post'
import gsap from 'gsap'
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
renderer.setSize(window.innerWidth, window.innerHeight)
//pass in camera and renderer dom element
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
const scene = new THREE.Scene()
const meshes = {}
const lights = {}
const composer = post(scene, camera, renderer)
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
init()
function init() {
	//set up our renderer default settings, add scene/canvas to webpage
	document.body.appendChild(renderer.domElement)

	meshes.default = addBoilerPlateMeshes()
	meshes.standard = addStandardMesh()
	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.standard)
	scene.add(meshes.default)

	camera.position.set(0, 0, 5)
	raycast()
	resize()
	animate()
}
function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children)
		for (let i = 0; i < intersects.length; i++) {
			if (intersects[i].object.userData.name == 'target1') {
				gsap.to(intersects[i].object.scale, {
					x: 2,
					y: 2,
					z: 2,
					duration: 2,
					ease: 'power3.inOut',
				})
				gsap.to(composer.bloom, {
					strength: 1.3,
					duration: 2,
					onComplete: () => {
						gsap.to(composer.bloom, {
							strength: 0.3,
							duration: 2,
						})
					},
				})
				gsap.to(composer.glitch, {
					enabled: true,
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
		composer.composer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	const elapsedTime = clock.getElapsedTime()
	controls.update()
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y -= 0.01
	meshes.standard.rotation.x -= 0.01
	meshes.standard.rotation.z -= 0.01
	meshes.standard.position.y = Math.sin(elapsedTime)
	meshes.default.position.y = Math.cos(elapsedTime)

	composer.composer.render()
	// renderer.render(scene, camera)
}
