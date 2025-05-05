const app = require("./src/app");
const PORT = process.env.PORT || 3000;
// const { startEmailListener } = require("./src/service/emailListerner");

// startEmailListener();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
