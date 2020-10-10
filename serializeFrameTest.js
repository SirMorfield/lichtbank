const serializeFrame = require('./serializeFrame.js')(48, 72)
const standardFrame = require('./standard.json')
const serialized = serializeFrame(standardFrame[0])
console.log(serialized.length)
