import {
	DirectionalLight,
	PointLight,
	Mesh,
	SphereGeometry,
	MeshBasicMaterial,
	SpotLight,
	AmbientLight,
	HemisphereLight,
} from 'three'

export const addLight = () => {
	let light = new DirectionalLight(0xffc342, 10)
	light.position.set(0, 2.709, -8.212)

	// light.position.set(100, 1000, 100)

	return light
}

export const mouseLight = () => {
	let light = new PointLight(0xffffff, 1)
	// pointLight.position.set(0, 0, 50);
	// scene.add(pointLight);

	// To make the light visible, add a small sphere to represent the light's position
	const sphereSize = 0.1
	const pointLightMesh = new Mesh(
		new SphereGeometry(sphereSize, 16, 8),
		new MeshBasicMaterial({ color: 0xffffff })
	)
	light.add(pointLightMesh)
	return light
}

export const ambient = () => {
	let light = new AmbientLight(0xffffff, 0.34)
	return light
}

export const hemi = () => {
	let light = new HemisphereLight(0xffffff, 0xffaa00, 1)
	light.position.set(0, 12.5, 0)
	return light
}
