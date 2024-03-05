import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export function post({ scene, camera, renderer }) {
	const composer = new EffectComposer(renderer)
	composer.setSize(
		window.innerWidth * window.devicePixelRatio,
		window.innerHeight * window.devicePixelRatio
	)
	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)
	const glitchPass = new GlitchPass()
	composer.addPass(glitchPass)
	const outputPass = new OutputPass()
	composer.addPass(outputPass)
	return composer
}
