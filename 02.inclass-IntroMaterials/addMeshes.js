import {
	BoxGeometry,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Mesh,
	SphereGeometry,
	MeshPhysicalMaterial,
	TextureLoader,
	MeshPhongMaterial,
	MeshLambertMaterial,
} from 'three'

const loader = new TextureLoader()

export const addBoilerPlateMeshes = () => {
	//Mesh basic doesn't take into account dimensionality and shading or any lights.
	const box = new BoxGeometry(1, 1, 1)
	const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export const addStandardMesh = () => {
	//PBR (physically based rendering), material allowing for metalness and roughness parameters to adjust how reflective and how matte an object should look
	const sphereGeometry = new SphereGeometry(0.5, 100, 100)
	const sphereMaterial = new MeshStandardMaterial({ color: 0x00ff00 })
	const standardSphere = new Mesh(sphereGeometry, sphereMaterial)
	standardSphere.position.set(2, 0, 0)
	return standardSphere
}

export const addPhysicalMesh = () => {
	// an advanced form of standard material that offers better computations for things like reflection and refraction
	const sphereGeometry = new SphereGeometry(0.5, 100, 100)
	const sphereMaterial = new MeshPhysicalMaterial({
		map: loader.load('Ice_001_COLOR.jpg'),
		normalMap: loader.load('Ice_001_NRM.jpg'),
		aoMap: loader.load('Ice_001_OCC.jpg'),
		displacementMap: loader.load('Ice_001_DISP.png'),
		displacementScale: 0.3,
		metalness: 0.1,
		roughness: 0.0,
		transmission: 0.5,
		ior: 2.33,
	})
	const sphereMesh = new Mesh(sphereGeometry, sphereMaterial)
	return sphereMesh
}

export const addPhongMaterial = () => {
	//phong materials can simulate specular highlights and reflective surfaces
	const sphereGeometry = new SphereGeometry(0.5, 100, 100)
	const sphereMaterial = new MeshPhongMaterial({
		color: 0x00ff00,
		specular: 0xffffff,
		shininess: 20,
		emissive: 0xff0000,
	})
	const phongMesh = new Mesh(sphereGeometry, sphereMaterial)
	phongMesh.position.set(-4, 0, 0)
	return phongMesh
}

export const addLambertMaterial = () => {
	//lambert materials can simulate matte surfaces
	const sphereGeometry = new SphereGeometry(0.5, 100, 100)
	const sphereMaterial = new MeshLambertMaterial({
		color: 0x0000ff,
		emissive: 0x00ff00,
	})
	const lambertMesh = new Mesh(sphereGeometry, sphereMaterial)
	lambertMesh.position.set(4, 0, 0)
	return lambertMesh
}
