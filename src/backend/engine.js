import dialogPromise from '../dialog'

export default (async() => {
    const dialog = await dialogPromise

    function getAttributes() {
		let attributeNameRefs = [211, 212, 213, 215, 214, 216]
		let attributeDescRefs = [222, 223, 224, 226, 225, 227]

		return [0, 1, 2, 3, 4, 5].map(i => ({
			name: dialog.t(attributeNameRefs[i])
			, description: dialog.t(attributeDescRefs[i])
		}))
    }

    return {
        getAttributes
    }
})()