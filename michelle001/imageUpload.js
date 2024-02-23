import { TextureLoader } from 'three'
export function imageHandler(callback) {
	const input = document.querySelector('.imageUploader')
	input.addEventListener('change', () => {
		if (input.files.length > 0) {
			const file = input.files[0]
			const url = URL.createObjectURL(file) // Create a URL for the file

			const loader = new TextureLoader()
			loader.load(
				url, // Use the URL created from the file
				(texture) => {
					// This callback function is called once the texture is loaded
					texture.needsUpdate = true

					// Execute the callback function with the loaded texture
					if (typeof callback === 'function') {
						callback(texture)
					}

					// Clean up the object URL to release memory
					URL.revokeObjectURL(url)
				},
				undefined, // onProgress callback not needed here
				(error) => {
					console.error(
						'An error happened during texture loading.',
						error
					)
				}
			)
		}
	})
}
