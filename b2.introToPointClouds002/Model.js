import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import {
	Color,
	AnimationMixer,
	PointsMaterial,
	Points,
	MeshMatcapMaterial,
	TextureLoader,
	Vector3,
	BufferGeometry,
	Float32BufferAttribute,
	AdditiveBlending,
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
			matcap: this.textureLoader.load('/mat.png'),
		})
		this.mixer = null
		this.mixers = obj.mixers
		this.particleMaterial = new PointsMaterial({
			map: this.textureLoader.load('/1.png'),
			size: 0.0,
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
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					this.mesh = child
				}
			})
			const palette = [
				new Color('#FAAD80'),
				new Color('#FF6767'),
				new Color('#FF3D68'),
				new Color('#A73489'),
			]

			const sampler = new MeshSurfaceSampler(this.mesh).build()
			const numParticles = 3000
			const particlesPosition = new Float32Array(numParticles * 3)
			const particleColors = new Float32Array(numParticles * 3)
			const newPosition = new Vector3()
			for (let i = 0; i < numParticles; i++) {
				sampler.sample(newPosition)
				const color =
					palette[Math.floor(Math.random() * palette.length)]
				particleColors.set([color.r, color.g, color.b], i * 3)
				particlesPosition.set(
					[newPosition.x, newPosition.y, newPosition.z],
					i * 3
				)
			}
			const pointsGeometry = new BufferGeometry()
			pointsGeometry.setAttribute(
				'position',
				new Float32BufferAttribute(particlesPosition, 3)
			)
			pointsGeometry.setAttribute(
				'color',
				new Float32BufferAttribute(particleColors, 3)
			)
			const pointsMaterial = new PointsMaterial({
				vertexColors: true,
				transparent: true,
				alphaMap: this.textureLoader.load('/10.png'),
				alphaTest: 0.001,
				depthWrite: false,
				blending: AdditiveBlending,
				size: 0.1,
			})
			const points = new Points(pointsGeometry, pointsMaterial)
			this.meshes.model = points
			this.meshes.model.scale.set(0.015, 0.015, 0.015)
			this.scene.add(this.meshes.model)
		})
	}
}
