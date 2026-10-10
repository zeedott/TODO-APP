
import express from "express";
import cors from "cors";
import route from "./route/todo.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/", route);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
