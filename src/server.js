
//require('dotenv').config();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const axios = require('axios');
const OpenAiApiStatusIndicator = require('./OpenAiApiStatusIndicator');
const {AxiosError} = require("axios");
const app = express();
const port = process.env.LISTENING_PORT || 9091;
const endpoints= {
    _root:process.env.LISTENING_ENDPOINT_ROOT || '/open-ai-status-prober',
    simplified_status:process.env.LISTENING_ENDPOINT_SIMPLIFIED_STATUS || '/simplified_status'
}

function generateEndpoint(endpoint){
    return endpoints._root+endpoint;
}


const openaiApiIndicators=OpenAiApiStatusIndicator.indicators;

app.get(generateEndpoint(endpoints.simplified_status), async (req, res) => {
    let apiStatusResponse;
    try {
        apiStatusResponse = await axios.get('https://status.openai.com/api/v2/status.json');
        const statusIndication = apiStatusResponse.data.status.indicator;
        //const isOpenaiApiOperational= openaiApiIndicators.operational.includes(statusIndication);

        const correspondingIndication=openaiApiIndicators.find(x=>x.indicatorSlug===statusIndication);

        response(res,'success',correspondingIndication.httpStatusTranslation,correspondingIndication,apiStatusResponse);
    } catch (error) {
        let errorBag=[];
        if(error instanceof AxiosError){
            //res.status(500).send('Error fetching OpenAI status');
            errorBag.push('Error fetching OpenAI status');
        }else{
            errorBag.push(
                `Unexpected error occurred: ${error.message}. 
                ST: ${error.stack}
            `);
        }

        response(res,'error',500,null,apiStatusResponse,errorBag);



    }
});

app.get('/', (req, res) => {
    res.send(`OpenAI API Status Prober up and running at port: ${req.socket.localPort??'unknown'}`)
})

app.listen(port, () => {
    console.log(`Custom exporter listening at http://localhost:${port}`);
});



function response(expressJSResponse,statusLabel,httpStatus,indicator=null,openAiOriginalResponse=null,errors=null){

    const responseData = {
        status: openAiOriginalResponse?.status,
        data: openAiOriginalResponse?.data
        // Add more fields if necessary
    };
    const response={
        status:statusLabel,
        http_status:httpStatus,
        open_ai:{
            indicator_slug:indicator?.indicatorSlug,
            indicator:indicator?.publicRepresentation(),
            original_response:responseData
        },
        errors:errors
    }

    return expressJSResponse.status(httpStatus).json(response);

}


module.exports = app;