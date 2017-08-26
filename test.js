const { test } = require('tap')
const Screenshot = require('.')
const http = require('http')

let server, url

test('setup', t => {
  server = http.createServer((req, res) => res.end('ohai!'))
  server.listen(() => {
    url = `http://localhost:${server.address().port}`
    t.end()
  })
})

test('screenshot', async t => {
  const s = new Screenshot(url)
  const pic = await s.capture()
  t.ok(pic)
  t.ok(Buffer.isBuffer(pic))
})

test('custom args', async t => {
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
})

test('obj', async t => {
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
})

test('cleanup', t => {
  server.close()
  t.end()
})
