// check.js
require('dotenv').config()
const https = require('https')

console.log("Check results for build: " + process.env.BUILD)

const options = {
    hostname: 'www.tesults.com',
    path: encodeURI('/api/results?target=' + process.env.TARGET1_ID + '&build=' + process.env.BUILD),
    headers: {
        Authorization: 'Bearer ' + process.env.API_TOKEN
    }
}
https.get(options, (response) => {
    var result = ''
    response.on('data', function (chunk) {
        result += chunk;
    });
    response.on('end', function () {
        try {
            const resultObject = JSON.parse(result)
            const run = resultObject.data.results.runs[0]
            if (run.pass !== run.total) {
                console.log(run.pass + " tests passed out of " + run.total)
                process.exit(1)
            } else {
                console.log("All tests passed. Total tests: " + run.total)
                process.exit(0)
            }
        } catch (err) {
            console.log("Error: " + err)
            console.log(result)
            process.exit(1)
        }
    });
})