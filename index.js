const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require("node-cron");
const axios = require("axios");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

require('dotenv').config();

const stockRoutes = require('./routes/userStocks');
const stockInfoRoutes = require('./routes/stockInfo');
const userRoutes = require('./routes/user');
const routes = require('./routes/api');

const app = express();

const port = process.env.PORT || 5000;

//connect to the database
mongoose.connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use('/api', routes);
app.use('/userStocks', stockRoutes);
app.use('/stockInfo', stockInfoRoutes);
app.use('/user', userRoutes);

app.use(cookieParser());

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

cron.schedule("* * * * *", function() {
  //update portfolio of user 5e9a55c652f6c0ac6745a9f9
  axios.get("http://localhost:5000/stockInfo/updatePortfolioHistory/5e9a55c652f6c0ac6745a9f9");
  console.log("running a task every minute");

});
