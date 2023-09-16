const axios = require('axios')

const axiosInstance = axios.create({
    timeout: 0,
    headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    }
});

module.exports = axiosInstance