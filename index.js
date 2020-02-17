const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const cors = require('cors');

const config = require('config');
const PORT = config.get('default.route_port');

const app = express();
app.use(bodyParser.json());
app.use(cors());

require('./routes/ClaimRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Routes running on port ${PORT}`)
});