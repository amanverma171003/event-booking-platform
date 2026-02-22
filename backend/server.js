require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const runExpiryJob = require("./src/cron/expiry.job");


connectDB();
runExpiryJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
