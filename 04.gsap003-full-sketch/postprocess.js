import {
	BloomEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	SMAAEffect,
	SMAAPreset,
} from 'postprocessing'
// import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

export function post(camera, renderer, scene) {
	const composer = new EffectComposer(renderer)
	composer.setSize(
		window.innerWidth * window.devicePixelRatio,
		window.innerHeight * window.devicePixelRatio
	)

	composer.addPass(new RenderPass(scene, camera))
	composer.addPass(new EffectPass(camera, new SMAAEffect(SMAAPreset.HIGH)))
	composer.addPass(
		new EffectPass(
			camera,
			new BloomEffect({
				luminanceSmoothing: 0.95,
				luminanceThreshold: 0.7,
				intensity: 1.75,
				mipmapBlur: true,
			})
		)
	)
	return composer
}
