import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'

export default function initTheatre(obj) {
	studio.initialize()
	//create a project for our animation sequences
	const project = getProject('Intro to Theatre')
	const sheet = project.sheet('Animated Scene')
	const cameraObj = sheet.object('Camera', {
		position: types.compound({
			x: types.number(obj.camera.position.x, { range: [-20, 20] }),
			y: types.number(obj.camera.position.y, { range: [-20, 20] }),
			z: types.number(obj.camera.position.z, { range: [-20, 20] }),
		}),
	})
	cameraObj.onValuesChange((values) => {
		const { x, y, z } = values.position
		obj.camera.position.set(x, y, z)
	})
}
