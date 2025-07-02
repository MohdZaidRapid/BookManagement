const app = require("./app");
require("dotenv").config();

console.log(process.env.SECRET_KEY);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
