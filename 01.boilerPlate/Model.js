import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import {
	AnimationMixer,
	PointsMaterial,
	Points,
	MeshMatcapMaterial,
	TextureLoader,
} from 'three'

export default class Model {
	constructor(obj) {
		this.name = ''
		this.meshes = obj.meshes
		this.file = obj.url
		this.scene = obj.scene
		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('./draco/')
		this.loader.setDRACOLoader(this.dracoLoader)
		this.textureLoader = new TextureLoader()
		this.animations = obj.animationState
		this.replaceMaterials = obj.replace
		this.replacementMaterial = new MeshMatcapMaterial({
			// this.textureLoader.load()
			matcap: this.textureLoader.load('/mat.png'),
		})
		this.mixer = null
		this.mixers = obj.mixers
		this.particleMaterial = new PointsMaterial({
			size: 0.02,
			sizeAttenuation: true,
		})
	}
	init() {
		this.loader.load(this.file, (gltf) => {
			this.mesh = gltf.scene.children[0]
			if (this.replaceMaterials) {
				gltf.scene.traverse((child) => {
					if (child.isMesh) {
						child.material = this.replacementMaterial
					}
				})
			}
			if (this.animations) {
				this.mixer = new AnimationMixer(gltf.scene)
				gltf.animations.forEach((clip) => {
					this.mixer.clipAction(clip).play()
				})
				this.mixers.push(this.mixer)
			}
			this.meshes.model = gltf.scene

			this.scene.add(this.meshes.model)
		})
	}
	initPoints() {
		this.loader.load(this.file, (gltf) => {
			this.mesh = gltf.scene.children[0]
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					this.particleGeometry = child.geometry
				}
			})
			this.meshes.model = new Points(
				this.particleGeometry,
				this.particleMaterial
			)
			this.meshes.model.scale.set(0.015, 0.015, 0.015)
			this.scene.add(this.meshes.model)
		})
	}
}
