import dotenv from "dotenv";
dotenv.config();

import app from "./express.app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
