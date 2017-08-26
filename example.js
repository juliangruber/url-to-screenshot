const Screenshot = require('.')
const fs = require('fs')
const { join } = require('path')

new Screenshot('http://ghub.io/').width(800).height(600).capture().then(img => {
  fs.writeFileSync(join(__dirname, '/example.png'), img)
  console.log('open example.png')
})
