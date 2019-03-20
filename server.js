const path = require('path');
const jsonServer = require('json-server');
const axios = require('axios');
const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();
const fsExtra = require('fs-extra');
const jServerPort = 3005;

const settings = {
  configPath: './config/private.json', // Location for SharePoint instance mapping and credentials
  port: 3006 // Local server port
  //   staticRoot: './static'               // Root folder for static content
};
const spurls = require('./spurls')(settings);

const RestProxy = require('sp-rest-proxy');
const restProxy = new RestProxy(settings);
restProxy.serve();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    "/schools/dis/_api/web/lists/getbytitle\\(':title'\\)/items*": '/:title',
    "/sites/resourcebooking/_api/web/lists/getbytitle\\(':title'\\)/items*": '/:title',
    '/sites/resourcebooking/_api/web/AvailableContentTypes*': '/AvailableContentTypes',
    "/sites/resourcebooking/_api/web/fields/GetByTitle\\(':title'\\)*": '/:title',
    '/sites/resourcebooking/_api/web/siteusers*': '/siteusers',
    '/db': '/db',
    '/reload': '/reload',
    '/reset': '/reset'
  })
);
// server.use(jsonServer.rewriter(require('./routes.json')));

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.get('/reset', (req, res) => {
  console.log(`::: Reseting db on JSON Server is running on port ${jServerPort}`);
  const defaultDb = Object.keys(spurls).reduce((prev, next) => {
    prev[next] = [];
    return prev;
  }, {});
  fsExtra.outputJSONSync(dbPath, defaultDb, null, err => {
    console.log(err);
  });
  res.redirect(`http://localhost:${jServerPort}`);
});

const headers = { headers: { Accept: 'application/json;odata=nometadata', 'Content-Type': 'application/json;odata=nometadata' } };
server.get('/reload', (req, res) => {
  console.log(`::: Reloading db on JSON Server is running on port ${jServerPort}`);
  const defaultDb = Object.keys(spurls).reduce((prev, next) => {
    prev[next] = [];
    return prev;
  }, {});
  let $q = [];
  Object.keys(spurls).forEach(k => {
    console.log(`Loading data for ${k}`);
    $q.push(
      axios.get(spurls[k], headers).then(response => {
        defaultDb[k] = (response.data.value || response.data.Choices).map(item => {
          item.hasOwnProperty('ID') && delete item['ID'];
          return item;
        });
      })
    );
  });
  Promise.all($q).then(() => {
    fsExtra.outputJSONSync(dbPath, defaultDb, null, err => {
      console.log(err);
    });
    res.redirect(`http://localhost:${jServerPort}`);
  });
});

// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {
  switch (req.url.trim().toLowerCase()) {
    case '/SCCategory'.trim().toLowerCase():
      res.jsonp({
        Choices: res.locals.data
      });
      break;
    default:
      console.log(req.url.trim(), req.url.trim().toLowerCase() === '/SCCategory'.trim().toLowerCase());
      res.jsonp({
        value: res.locals.data
      });
      break;
  }
};

router.db._.id = 'Id';
server.use(router);
server.listen(jServerPort, () => {
  console.log(`JSON Server is running on port ${jServerPort}`);
  console.log(`...... To RESET DB visit 'http://localhost:${jServerPort}/reset/`);
  console.log(`...... To RELOAD DB visit 'http://localhost:${jServerPort}/reload/`);
});
