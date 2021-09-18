require('dotenv').config();

module.exports = {
    USER: process.env.USERNAME,
    PASS: process.env.PASSWORD,
    
    TESTUSER: process.env.TESTUSER,
    TESTPASS: process.env.TESTPASS,

    ENVIRONMENT: process.env.NODE_ENV
}