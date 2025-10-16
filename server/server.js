const {server} = require('./app');

const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});