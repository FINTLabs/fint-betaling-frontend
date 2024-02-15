const express = require('express');
const path = require('path');
const rewrite = require('express-urlrewrite');
const morgan = require('morgan');
const log4js = require("log4js");
const log = log4js.getLogger();
const promMid = require('express-prometheus-middleware');


const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.BASE_PATH || "/";
log.level = process.env.LOGGING_LEVEL || "info"

const app = express();

app.use(morgan("combined"))
app.use(rewrite(/\/static\/(\w.+)/i, BASE_PATH + '/static/$1'));
app.use(rewrite(/\/manifest.json$/, BASE_PATH + '/manifest.json'));
app.use(rewrite(/\/api\/application\/configuration/, `${BASE_PATH}/api/application/configuration`));
app.use(promMid({
    metricsPath: `${BASE_PATH}/metrics`,
    collectDefaultMetrics: true,
}));

app.use(BASE_PATH + '/', express.static(path.join(`${__dirname}/../`, 'build')));

app.get(`${BASE_PATH}/api/application/configuration`, (req, res) => {
    res.send({
        basePath: BASE_PATH
    })
})

app.get(`${BASE_PATH}/*`, (req, res) => {
    console.log("Request path", req.path);
    if (req.path.includes("/api/")) {
        res.send([])
    } else {
        res.sendFile(path.join(`${__dirname}/../`, 'build', 'index.html'));
    }
});


app.listen(PORT, () => log.info(`Application started on http://localhost:${PORT}${BASE_PATH}`));