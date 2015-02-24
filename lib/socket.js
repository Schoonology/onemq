'use strict'

/**
 * TODO: Description.
 */
var events = require('events')
  , stream = require('stream')
  , util = require('util')
  , common = require('./common')
  , Peer = require('./protocol/peer')

/**
 * Creates a new instance of Socket with the provided `options`.
 *
 * @param {Object} options
 */
function Socket(options) {
  if (!(this instanceof Socket)) {
    return new Socket(options)
  }

  options = options || {}

  events.EventEmitter.call(this)

  this._servers = []
  this._clients = []
  this._peers = []
}
util.inherits(Socket, events.EventEmitter)

/**
 * TODO: Description.
 */
Socket.prototype.bind = function bind(endpoint) {
  var self = this
    , server = common.createServer(endpoint)

  if (!server) {
    // TODO(schoon) - Throw, as this is an invalid endpoint?
    return self
  }

  self._servers.push(server)

  server.on('connection', function (socket) {
    self.addPeer(new Peer({ stream: socket }))
  })

  return self
}

/**
 * TODO: Description.
 */
Socket.prototype.connect = function connect(endpoint) {
  var client = common.createClientSocket(endpoint)

  if (!client) {
    return this
  }

  this._clients.push(client)

  this.addPeer(new Peer({ stream: client }))

  return this
}

/**
 * TODO: Description.
 */
Socket.prototype.addPeer = function addPeer(peer) {
  var self = this

  self._peers.push(peer)

  peer.on('end', function () {
    self._peers.splice(self._peers.indexOf(peer), 1)
  })
}

/**
 * TODO: Description.
 */
Socket.prototype.send = function send(message) {
  throw new Error('Send behaviour undefined for ' + this.constructor.name + ' sockets.')
}

/**
 * TODO: Description.
 */
Socket.prototype.close = function close() {
  var self = this

  self._servers.forEach(function (server) {
    server.close()
  })

  self._clients.forEach(function (client) {
    client.end()
  })

  self._servers = []
  self._clients = []
  self._peers = []
}

/*!
 * Export `Socket`.
 */
module.exports = Socket