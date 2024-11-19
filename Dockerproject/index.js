const express = require("express");
const app = express();

app.get("/home", (req, resp) => {
  resp.json({ status: "changes made" });
});

app.listen({ port: 5000 }, () => {
  console.log("server started at 5000000");
});
