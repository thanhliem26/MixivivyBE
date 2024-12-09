require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Project is running with port http://localhost:${PORT}`);
});

process.on("message", (message) => {
  console.log('check', message);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
