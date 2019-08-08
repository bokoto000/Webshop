const express = require('express');
const app = express();

require('./config/config')(app);
const port = process.env.port || 5001;

app.listen(port, () => console.log(`Listening on port ${port}`));

