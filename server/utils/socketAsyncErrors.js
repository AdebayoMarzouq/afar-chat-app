const socketHandler = async (socket, cb) => {
  try {
    await cb()
  } catch (error) {
    console.log(error)
    socket.emit('server_error', error.message)
  }
}

module.exports = socketHandler
