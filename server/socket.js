let onlineUsers = new Map();
let ioInstance = null;

module.exports = {
    onlineUsers,
    setIO: (io) => ioInstance = io,
    getIO: () => ioInstance
};
