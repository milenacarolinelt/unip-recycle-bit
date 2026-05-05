const express = require('express');
const router = express.Router();
const compression = require('compression');
const PagesController = require('../controllers/PagesController');
const handler = require('express-async-handler');

const app = express();

// compress all responses
app.use(compression());

router.get('/', handler(PagesController.home));

module.exports = router;
