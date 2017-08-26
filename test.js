const test = require('tape')
const Screenshot = require('.')
const http = require('http')

const server = http.createServer((req, res) => res.end('ohai!')).listen(() => {
  const url = `http://localhost:${server.address().port}`

  test('screenshot', t => {
    t.plan(3)
    new Screenshot(url).capture((err, pic) => {
      t.error(err)
      t.ok(pic)
      t.ok(Buffer.isBuffer(pic))
    })
  })

  test('custom args', t => {
    const s = new Screenshot(url)
      .width(1024)
      .height(768)
      .timeout(100)
      .format('jpeg')
      .clip()
    t.equal(s._width, 1024)
    t.equal(s._height, 768)
    t.equal(s._timeout, 100)
    t.equal(s._format, 'JPG')
    t.equal(s._clip, true)
    t.end()
  })

  test('obj', t => {
    const s = new Screenshot(url, {
      width: 1024,
      height: 768,
      timeout: 100,
      format: 'jpeg',
      url: 'trololo',
      clip: true
    })
    t.equal(s._width, 1024)
    t.equal(s._height, 768)
    t.equal(s._timeout, 100)
    t.equal(s._format, 'JPG')
    t.equal(s.url, url)
    t.equal(s._clip, true)
    t.end()
  })

  test('generator', t => {
    t.plan(3)
    new Screenshot(url).capture()((err, pic) => {
      t.error(err)
      t.ok(pic)
      t.ok(Buffer.isBuffer(pic))
      server.close()
    })
  })
})
