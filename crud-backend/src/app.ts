import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
