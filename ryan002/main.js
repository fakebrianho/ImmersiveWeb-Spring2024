import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Type from './Type'

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

	lights.default = addLight()

	scene.add(lights.default)

	camera.position.set(0, 0, 5)
	typography()
	resize()
	animate()
}

function typography() {
	const tLoader = new THREE.TextureLoader()
	const word1 = new Type({
		fontFile: '/KenPixel_Regular.json',
		material: new THREE.MeshMatcapMaterial({
			matcap: tLoader.load('/mat.png'),
		}),
		position: new THREE.Vector3(-5, 0, 0),
		meshes: meshes,
		scene: scene,
		text: 'Hello',
		name: 'word001',
	})
	word1.init()
	const word2 = new Type({
		fontFile: '/IM.json',
		material: new THREE.MeshBasicMaterial({
			wireframe: true,
		}),
		position: new THREE.Vector3(-2, 0, 0),
		meshes: meshes,
		scene: scene,
		text: 'THREE.JS',
		name: 'word002',
	})
	word2.init()

	const word3 = new Type({
		fontFile: '/ARCHIVO.json',
		material: new THREE.MeshPhysicalMaterial({
			map: tLoader.load('Stylized_Fur_002_basecolor.jpg'),
			normalMap: tLoader.load('Stylized_Fur_002_normal.jpg'),
			aoMap: tLoader.load('Stylized_Fur_002_ambientOcclusion.jpg'),
			displacementMap: tLoader.load('Stylized_Fur_002_height.png'),
			displacementScale: 0.1,
			metalness: 0.1,
			roughness: 0.0,
			transmission: 0.1,
			ior: 2.33,
		}),
		curveSegments: 64,
		bevelSegments: 32,
		position: new THREE.Vector3(2, 0, 0),
		meshes: meshes,
		scene: scene,
		text: 'WORLD',
		name: 'word003',
	})
	word3.init()
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
