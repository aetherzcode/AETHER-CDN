import express, { Request, Response } from "express";
import path from "path";
import fs from "fs"; 
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import cors from "cors";
import morgan from "morgan";
import fileRouter from "./routers/fileRouter";

const app = express();
const port = process.env.PORT || 4321;

const hbs = engine({
  extname: "jmk",
  layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
});

Handlebars.registerHelper(
  "includes",
  function (str: string, substring: string) {
    return str.includes(substring);
  },
);

Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
});

app.set("json spaces", 2);
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.engine("jmk", hbs);
app.set("view engine", "jmk");
app.set("views", path.join(__dirname, "../views"));

app.use("/f", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../node_modules")));

app.use(fileRouter);

app.get("/list-files", async (req: Request, res: Response) => {
  const folderPath = path.join(__dirname, "../uploads");

  try {
    const files = await fs.promises.readdir(folderPath);

    res.status(200).json({
      message: "File list fetched successfully",
      files,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Failed to fetch file list",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Failed to fetch file list",
        error: "An unknown error occurred",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
