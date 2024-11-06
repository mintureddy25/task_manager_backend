const express = require("express");
const app = express();
cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Set the default timezone to West African Time (Africa/Lagos)
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Africa/Lagos");


const loginRouter = require('./auth/login');
const signupRouter = require('./auth/signup');
const tasksRouter = require('./controllers/tasks');




app.use(loginRouter);
app.use(signupRouter);
app.use("/tasks", tasksRouter);



// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});