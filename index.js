const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

app.use("/api", userRouter);
app.use("/api", postRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
