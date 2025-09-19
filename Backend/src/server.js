const app = require("./app");
const { appLogger } = require("./middleware/logger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    appLogger.info({ started: true, port: PORT });
    console.log(`server is listening on port ${PORT}`);
});
