var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Trailhead | Art Forest | MAN-17 | Harvard Art Museums' });
});

router.get('/controller', function(req, res, next) {
  res.render('controller', { title: 'The Controller | Art Forest | MAN-17| Harvard Art Museums' });
});

router.get('/forest', function(req, res, next) {
  res.render('forest', { title: 'The Forest | Art Forest | MAN-17| Harvard Art Museums' });
});

router.get('/history', function(req, res, next) {
  res.render('history', { title: 'The History | Art Forest | MAN-17| Harvard Art Museums' });
});

router.get('/mcp', function(req, res, next) {
  res.render('admin', {layout: 'layout-admin', title: 'The MCP | Art Forest | MAN-17| Harvard Art Museums' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Test | Art Forest | MAN-17| Harvard Art Museums' });
});

router.post('/snapshots', function(req, res, next) {
  let base64Data = req.body.imgBase64.split(';base64,').pop();
  let filename = `ham-forest-${(Math.floor(new Date() / 1000)).toString(36)}.png`;
  fs.writeFile(`public\\images\\snapshots\\${filename}`, base64Data, {encoding: 'base64'}, function(err) {
    console.log('done');
  })
  res.json({filename: filename, path: "/images/snapshots"});
});

module.exports = router;
