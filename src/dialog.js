import axios from 'axios'

export default (async function() {
    const dialog = (await axios.get('/static/dialog.xml', {
        responseType: 'document'
    })).data
    
    function t(id) {
        const node = dialog.getElementById(id)
        if (node) {
            return node.textContent
        }
        return null
    }

    return { t }
})()