class SocketError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = SocketError