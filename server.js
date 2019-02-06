const path = require('path');
const jsonServer = require('json-server');
const axios = require('axios');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
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
    '/blog/:resource/:id/show': '/:resource/:id'
  })
);
server.use(jsonServer.rewriter(require('./routes.json')));

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.get('/reset', (req, res) => {
  console.log(
    `::: Reseting db on JSON Server is running on port ${jServerPort}`
  );
  router.db.setState(defaultDb);
  server.db = router.db;
  server.db.setState(server.db.getState());
  res.sendStatus(201);
});

server.get('/reload', (req, res) => {
  console.log(
    `::: Reloading db on JSON Server is running on port ${jServerPort}`
  );
  let $q = [];
  Object.keys(spurls).forEach(k => {
    console.log(k);
    $q.push(
      axios.get(spurls[k]).then(
        // res => console.log(res.data.value[0]['Id'], res.data.value[0]["odata.type"]),
        res =>
          res.data.value.forEach(item => {
            delete item['ID'];
            return axios
              .post(`http://localhost:${jServerPort}/${k}`, item)
              .then(d => {
                console.log(d.data['Id'], d.data['odata.type']);
                return d;
              })
              .catch(e => {
                // console.log(e.response);
                const { status, statusText, config } = e.response;
                const { data } = config;
                console.log({ status, statusText, data: JSON.parse(data) });
              }); //[ 'status', 'statusText', 'headers', 'config', 'request', 'data' ]
          }),
        err => console.error(err)
      )
    );
  });
  Promise.all($q).then(() => {
    res.sendStatus(201);
  });
});

//const defaultDb1 = Object.keys(spurls).map((k) => ({ [k]: [] })); console.log(defaultDb1);
const defaultDb = Object.keys(spurls).reduce((prev, next) => {
  prev[next] = [];
  return prev;
}, {});
router.db._.id = 'Id';
server.use(router);
server.listen(jServerPort, () => {
  console.log(`JSON Server is running on port ${jServerPort}`);
  console.log(
    `...... To RESET DB visit 'http://localhost:${jServerPort}/reset/`
  );
  console.log(
    `...... To RELOAD DB visit 'http://localhost:${jServerPort}/reload/`
  );
});
