const socket = io()

socket.on('message', printf)

let animationSelect = document.getElementById('loadSavedAnimationSelect')
socket.on('resAnimationNames', (names) => {
	animationSelect.options.length = 0
	for (const name of names) {
		let option = document.createElement('option')
		option.value = name
		option.text = name
		animationSelect.add(option)
	}
})
socket.emit('reqAnimationNames')

function loadSavedAnimation() {
	let value = animationSelect.options[animationSelect.selectedIndex].value
	socket.emit('loadAnimation', { id: value })
}

function saveAnimation() {
	socket.emit('saveAnimation', {
		name: prompt('Filename to save'),
		interval: getFrameInterval(),
		frames
	})
	socket.emit('reqAnimationNames')
}

socket.on('displayAnimation', playAnimation)

function loadAnimation() {
	socket.emit('loadAnimation', {
		frames,
		interval: getFrameInterval()
	})
}

function writeTime() {
	socket.emit('writeTime')
}