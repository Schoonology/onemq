'use strict'

var test = require('tape')
  , common = require('../lib/common')

test('tcp explicit connection', function (t) {
  var server = common.createServer('tcp://0.0.0.0:9999')

  t.plan(4)
  t.ok(server, 'server exists')

  server.on('connection', function (socket) {
    t.ok(socket, 'connection exists')

    socket.on('data', function (chunk) {
      t.equal(String(chunk), '1234', 'data matches')
    })

    socket.on('end', function () {
      server.close()
      t.end()
    })
  })

  server.on('listening', function () {
    var client = common.createClientSocket('tcp://0.0.0.0:9999')

    t.ok(client, 'client exists')

    client.end('1234')
  })
})

test('tcp wildcard connection', function (t) {
  var server = common.createServer('tcp://*:*')

  t.plan(4)
  t.ok(server, 'server exists')

  server.on('connection', function (socket) {
    t.ok(socket, 'connection exists')

    socket.on('data', function (chunk) {
      t.equal(String(chunk), '1234', 'data matches')
    })

    socket.on('end', function () {
      server.close()
      t.end()
    })
  })

  server.on('listening', function () {
    var client = common.createClientSocket(server.endpoint)

    t.ok(client, 'client exists')

    client.end('1234')
  })
})

test('ipc explicit connection', function (t) {
  var server = common.createServer('ipc:///tmp/onemq-test.sock')

  t.plan(4)
  t.ok(server, 'server exists')

  server.on('connection', function (socket) {
    t.ok(socket, 'connection exists')

    socket.on('data', function (chunk) {
      t.equal(String(chunk), '1234', 'data matches')
    })

    socket.on('end', function () {
      server.close()
      t.end()
    })
  })

  server.on('listening', function () {
    var client = common.createClientSocket('ipc:///tmp/onemq-test.sock')

    t.ok(client, 'client exists')

    client.end('1234')
  })
})

test('ipc wildcard connection', function (t) {
  var server = common.createServer('ipc://*')

  t.plan(4)
  t.ok(server, 'server exists')

  server.on('connection', function (socket) {
    t.ok(socket, 'connection exists')

    socket.on('data', function (chunk) {
      t.equal(String(chunk), '1234', 'data matches')
    })

    socket.on('end', function () {
      server.close()
      t.end()
    })
  })

  server.on('listening', function () {
    var client = common.createClientSocket(server.endpoint)

    t.ok(client, 'client exists')

    client.end('1234')
  })
})
