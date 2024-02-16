import {
	BoxGeometry,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Mesh,
	PlaneGeometry,
	TextureLoader,
	TorusKnotGeometry,
	MeshPhysicalMaterial,
	MeshMatcapMaterial,
	AnimationMixer,
} from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const tLoader = new TextureLoader()
const modelLoader = new GLTFLoader()

export const addBoilerPlateMeshes = () => {
	const box = new BoxGeometry(1, 1, 1)
	const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export const addStandardMesh = () => {
	const box = new BoxGeometry(1, 1, 1)
	const boxMaterial = new MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new Mesh(box, boxMaterial)
	boxMesh.position.set(2, 0, 0)
	return boxMesh
}

export const addBackground = () => {
	//(width, height, width segments, height segments)
	const backgroundGeometry = new PlaneGeometry(5, 5, 100, 100)
	const backgroundMaterial = new MeshStandardMaterial({
		map: tLoader.load('/fire.jpg'),
	})
	const background = new Mesh(backgroundGeometry, backgroundMaterial)
	background.position.set(0, 0, -3)
	return background
}

export const addTorus = () => {
	//(radius, tube, tube segments, radial segments, p ?, q ?)
	const glassGeometry = new TorusKnotGeometry(1, 0.3, 250, 20)
	//(map => color)
	const glassMaterial = new MeshPhysicalMaterial({
		map: tLoader.load('color.jpg'),
		normalMap: tLoader.load('normal.jpg'),
		aoMap: tLoader.load('ambient.jpg'),
		displacementMap: tLoader.load('displace.png'),
		displacementScale: 0.3,
		bumpMap: tLoader.load('roughness.jpg'),
		transmission: 1,
		metalness: 0,
		roughness: 0.1,
		thickness: 1,
	})
	const glassTorus = new Mesh(glassGeometry, glassMaterial)
	return glassTorus
}

export const addMatcap = () => {
	const matcapGeometry = new TorusKnotGeometry(1, 0.3, 250, 20)
	const matcapMaterial = new MeshMatcapMaterial({
		matcap: tLoader.load('matcap.png'),
	})
	const matcapMesh = new Mesh(matcapGeometry, matcapMaterial)
	// (x position, y position, z position)
	matcapMesh.position.set(-2, 0, 0)
	return matcapMesh
}

export const flowerModel = () => {
	return new Promise((resolve, reject) => {
		//using model loader we're going to async load a 3D model from our path
		modelLoader.load(
			'/heart.glb',
			//this function below is called if our modle is loaded correctly
			(gltf) => {
				const modelMixer = new AnimationMixer(gltf.scene)
				const newMaterial = new MeshMatcapMaterial({
					matcap: tLoader.load('/2.png'),
				})
				gltf.scene.traverse((child) => {
					if (child.isMesh) {
						child.material = newMaterial
					}
				})

				gltf.animations.forEach((clip) => {
					modelMixer.clipAction(clip).play()
				})
				resolve({ scene: gltf.scene, mixer: modelMixer })
			},
			undefined,
			(error) => {
				console.error(error)
				reject(error)
			}
		)
	})
}
