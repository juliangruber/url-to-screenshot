const { join } = require('path')
const { Buffer } = require('safe-buffer')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

module.exports = class Screenshot {
  /**
   * Create screenshot object.
   *
   * @param {String} url
   * @param {Object=} opts
   * @return {Screenshot}
   */

  constructor (url, opts) {
    this.url = url

    this.width(1024)
    this.height(768)
    this.timeout(0)
    this.format('png')
    this.ignoreSslErrors(false)
    this.sslCertificatesPath(null)
    this.sslProtocol('sslv3')
    this.clip(false)

    for (const key of Object.keys(opts || {})) {
      if (typeof this[key] === 'function') this[key](opts[key])
    }
  }

  /**
   * Set `width`.
   *
   * @param {Number} width
   * @return {Screenshot}
   */

  width (width) {
    this._width = width
    return this
  }

  /**
   * Set `height`.
   *
   * @param {Number} height
   * @return {Screenshot}
   */

  height (height) {
    this._height = height
    return this
  }

  /**
   * Set `timeout` for PhantomJS.
   *
   * @param {Number} timeout
   * @return {Screenshot}
   * @todo Find more flexible mechanism
   */

  timeout (timeout) {
    this._timeout = timeout
    return this
  }

  /**
   * Set output image format.
   *
   * Supported formats:
   *   - jpg, jpeg
   *   - png
   *   - gif
   *
   * @param {String} format
   * @throws {TypeError}
   * @return {Screenshot}
   */

  format (format) {
    format = format.toUpperCase()
    if (format === 'JPEG') format = 'JPG'
    if (['JPG', 'PNG', 'GIF'].indexOf(format) === -1) {
      throw new TypeError('unknown format')
    }
    this._format = format
    return this
  }

  /**
   * Ignore SSL Errors.
   *
   * @return {Screenshot}
   */

  ignoreSslErrors () {
    this._ignoreSslErrors = true
    return this
  }

  /**
   * Set the SSL certificates path for PhantomJS.
   *
   * @param {String} path
   * @return {Screenshot}
   */

  sslCertificatesPath (path) {
    this._sslCertificatesPath = path
    return this
  }

  /**
   * Set the SSL protocol to be used.
   *
   * Supported protocols:
   *
   *   - sslv3
   *   - sslv2
   *   - tlsv1
   *   - any
   *
   * @param {String} protocol
   * @return {Screenshot}
   */

  sslProtocol (protocol) {
    this._sslProtocol = protocol
    return this
  }

  /**
   * Clip the screenshot to `width` by `height`.
   *
   * @return {Screenshot}
   */

  clip (clip = true) {
    this._clip = clip
    return this
  }

  /**
   * Capture the screenshot.
   *
   * @return {Buffer}
   */

  async capture () {
    const args = []

    if (this._ignoreSslErrors) {
      args.push('--ignore-ssl-errors=true')
    }
    if (this._sslCertificatesPath) {
      args.push(`--ssl-certificates-path=${this._sslCertificatesPath}`)
    }
    if (this._sslProtocol) {
      args.push(`--ssl-protocol=${this._sslProtocol}`)
    }

    args.push(
      join(__dirname, '/script/render.js'),
      this.url,
      this._width,
      this._height,
      this._timeout,
      this._format,
      this._clip
    )

    const opts = { maxBuffer: Infinity }
    const { stdout } = await exec('phantomjs ' + args.join(' '), opts)
    if (/Unable to load/.test(stdout)) throw new Error(stdout)
    return Buffer.from(stdout, 'base64')
  }
}
