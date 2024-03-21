const express = require("express");
var cors = require("cors");
const app = express();
const connectDb = require("./utils/db.js");

const allRoute = require("./router/allRouter.js");
const contactRoute = require("./router/contact-router.js");
const quotationRoute = require("./router/getDataRouter.js");
const priceRoute = require("./router/priceRouter");

//Cors Policy
app.use(
  cors({
    origin: "https://calculation.cranebuffer.com/",
    credentials: true,
  })
);
// app.use(cors());

app.use(express.json());

app.use("/api/data", allRoute);
app.use("/api/form", contactRoute);
app.use("/api/data", quotationRoute);
app.use("/prices", priceRoute);

//Connection
const PORT = 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port no: ${PORT} `);
  });
});
