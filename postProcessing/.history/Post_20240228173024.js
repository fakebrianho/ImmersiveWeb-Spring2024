import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'

export function post(scene, camera, renderer) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const glitchPass = new GlitchPass()
	composer.addPass(glitchPass)

	const AfterImagePass = new AfterimagePass()
	AfterImagePass.uniforms.damp.value = 0.96
	AfterImagePass.damp = 0
	composer.addPass(AfterImagePass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.3
	// bloomPass.radius = 3
	// bloomPass.threshold = 0.3

	composer.addPass(bloomPass)

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	// return composer
	return { composer: composer, bloom: bloomPass }
}
