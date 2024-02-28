import { Pane } from 'tweakpane'

export const PARAMS = {
	displacementStrength: 0.5,
}

export const pane = new Pane()

const folder = pane.addFolder({
	title: 'Parameters',
})

folder.addInput(PARAMS, 'displacementStrength', {
	min: 0.1,
	max: 1.0,
	step: 0.1,
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
