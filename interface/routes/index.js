var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Controller | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/forest', function(req, res, next) {
  res.render('forest', { title: 'The Forest | Art Forest | ATP 6 | Harvard Art Museums' });
});

module.exports = router;
