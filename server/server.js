const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
