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
	AfterImagePass.uniforms.damp.value = 0.56
	AfterImagePass.damp = 0
	composer.addPass(AfterImagePass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 1.3
	bloomPass.radius = 3
	bloomPass.threshold = 2

	composer.addPass(bloomPass)

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	return composer
}
