require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.LISTENING_PORT || 9090;
const endpoints= {
    _root:process.env.LISTENING_ENDPOINT_ROOT || '/open-ai-status-prober',
    simplified_status:process.env.LISTENING_ENDPOINT_SIMPLIFIED_STATUS || '/simplified_status'
}

function generateEndpoint(endpoint){
    return endpoints._root+endpoint;
}


const openaiApiIndicators=[
    //TODO: use actual classes rather than mere arrays and anonymous objects like a hillbilly, be civilized.
    {indicator_slug:'none',http_status_translation:200,is_operational:true},
    {indicator_slug:'minor',http_status_translation:399,is_operational:true},
    {indicator_slug:'major',http_status_translation:500,is_operational:false},
    {indicator_slug:'critical',http_status_translation:500,is_operational:false}
]

app.get(generateEndpoint(endpoints.simplified_status), async (req, res) => {
    try {
        const apiStatusResponse = await axios.get('https://status.openai.com/api/v2/status.json');
        const statusIndication = apiStatusResponse.data.status.indicator;
        //const isOpenaiApiOperational= openaiApiIndicators.operational.includes(statusIndication);

        const correspondingIndication=openaiApiIndicators.find(x=>x.indicator_slug===statusIndication);

        // Translate OpenAI status to HTTP status
        const http_status =correspondingIndication.http_status_translation;

        res.status(http_status).send(`OpenAI Status: ${correspondingIndication.indicator_slug}`);//TODO optionally return original response and indicator object
    } catch (error) {
        res.status(500).send('Error fetching OpenAI status');
    }
});

app.listen(port, () => {
    console.log(`Custom exporter listening at http://localhost:${port}`);
});