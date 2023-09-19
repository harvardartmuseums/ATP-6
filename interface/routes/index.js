var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Trailhead | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/controller', function(req, res, next) {
  res.render('controller', { title: 'The Controller | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/forest', function(req, res, next) {
  res.render('forest', { title: 'The Forest | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/history', function(req, res, next) {
  res.render('history', { title: 'The History | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/mcp', function(req, res, next) {
  res.render('admin', { title: 'The MCP | Art Forest | ATP 6 | Harvard Art Museums' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'The MCP | Art Forest | ATP 6 | Harvard Art Museums' });
});

module.exports = router;
