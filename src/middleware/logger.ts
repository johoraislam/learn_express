import type { Request, Response, NextFunction } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Method-Url-time", req.method, req.url, Date.now());

  const log = `Method => ${req.method} Time => ${Date.now()} Url => ${req.url} \n`;

  fs.appendFile("logger.txt", log, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Log saved");
    }
  });

  next();
};

export default logger;
