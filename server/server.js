const app = require('./app');

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});