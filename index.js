const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const subscribeRoute = require('./src/routes/subscribeRoutes.js')
const viewRoute = require('./src/routes/viewRoutes.js')
const { connectToDatabase } = require('./src/connectionDb.js')


dotenv.config();
const app = express();


// db connection 
const MONGODB_URL = process.env.MONGODB_URL;
connectToDatabase(MONGODB_URL);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs setup 
app.set("view engine", 'ejs')
app.set('views', path.resolve('./src/views'))


// routing 
app.use('/', viewRoute);
app.use('/yt', subscribeRoute)


// listening 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})