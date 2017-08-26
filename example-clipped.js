const Screenshot = require('.')
const fs = require('fs')
const { join } = require('path')

new Screenshot('http://ghub.io/')
  .width(320)
  .height(320)
  .clip()
  .capture()
  .then(img => {
    fs.writeFileSync(join(__dirname, '/example-clipped.png'), img)
    console.log('open example-clipped.png')
  })
