const path = require('path');
const jsonServer = require('json-server');
const axios = require('axios');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const jServerPort = 3005;

const spurls = {
    LITimeSlotCategory: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LITimeSlotCategory')/items`
    , LITimeSlotGroup: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LITimeSlotGroup')/items?$select=*,SCTimeSlotCategory/Id,SCTimeSlotCategory/Title&$expand=SCTimeSlotCategory/Id`
    , LITimeSlot: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LITimeSlot')/items?$select=*,SCTimeSlotGroup/Id,SCTimeSlotGroup/Title&$expand=SCTimeSlotGroup/Id`
    , LIResource: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIResource')/items?$select=*,SCResourceGroup/Id,SCResourceGroup/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCResourceGroup/Id,SCCustodian/Id`
    , LIResourceGroup: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIResourceGroup')/items?$select=*,SCTimeSlotCategory/Id,SCTimeSlotCategory/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCTimeSlotCategory/Id,SCCustodian/Id`
    , LIAccessories: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIAccessories')/items?$select=*,SCCustodian/Id,SCCustodian/Title,SCResource/Id,SCResource/Title&$expand=SCCustodian/Id,SCResource/Id`
    , LIAcademicYear: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIAcademicYear')/items`
    , LIWeekMapping: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIWeekMapping')/items?$select=*,SCAcademicYear/Id,SCAcademicYear/Title,SCTimeSlotGroup/Id,SCTimeSlotGroup/Title&$expand=SCAcademicYear/Id,SCTimeSlotGroup/Id`
    , LIBooking: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIBooking')/items?$select=*,SCResource/Id,SCResource/Title,SCTimeSlot/Id,SCTimeSlot/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCResource/Id,SCTimeSlot/Id,SCCustodian/Id`
    , LIBookingAccessories: `http://localhost:${settings.port}/sites/resourcebooking/_api/Web/Lists/getbytitle('LIBookingAccessories')/items?$select=*,SCAccessories/Id,SCAccessories/Title,SCBooking/Id,SCBooking/SCDate&$expand=SCAccessories/Id,SCBooking/Id`
};

const RestProxy = require('sp-rest-proxy');
const settings = {
    configPath: './config/private.json', // Location for SharePoint instance mapping and credentials
    port: 3006,                          // Local server port
    //   staticRoot: './static'               // Root folder for static content
};

const restProxy = new RestProxy(settings);
restProxy.serve();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add custom routes before JSON Server router
server.get('/echo', (req, res) => { res.jsonp(req.query) })

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

server.post('/reset', (req, res) => {
    console.log(`::: Reseting db on JSON Server is running on port ${jServerPort}`);
    router.db.setState(defaultDb);
    server.db = router.db;
    server.db.setState(server.db.getState());
    res.sendStatus(201)
});

server.post('/reload', (req, res) => {
    console.log(`::: Reloading db on JSON Server is running on port ${jServerPort}`);
    let $q = [];
    Object.keys(spurls).forEach(k => {
        console.log(k)
        $q.push(axios.get(spurls[k]).then(
            // res => console.log(res.data.value[0]['Id'], res.data.value[0]["odata.type"]),
            res => res.data.value.forEach(item => {
                delete item['ID'];
                return axios.post(`http://localhost:${jServerPort}/${k}`, item)
                    .then(d => { console.log(d.data['Id'], d.data["odata.type"]); return d })
                    .catch(e => {
                        // console.log(e.response);
                        const { status, statusText, config } = e.response;
                        const { data } = config;
                        console.log({ status, statusText, data: JSON.parse(data) });
                    })//[ 'status', 'statusText', 'headers', 'config', 'request', 'data' ]
            }),
            err => console.error(err)
        ));
    });
    Promise.all($q).then(() => { res.sendStatus(201) });
})

server.use(router);
//const defaultDb1 = Object.keys(spurls).map((k) => ({ [k]: [] })); console.log(defaultDb1);
const defaultDb = Object.keys(spurls).reduce((prev, next) => { prev[next] = []; return prev; }, {});
router.db._.id = "Id";
server.listen(jServerPort, () => {
    console.log(`JSON Server is running on port ${jServerPort}`);
});
