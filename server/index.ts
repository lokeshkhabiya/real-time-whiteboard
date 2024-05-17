import { createServer } from "http";

import express from "express";
import next, { NextApiHandler } from "next";

const port = parseInt(process.env.NODE_ENV || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev });
const NextHandler: NextApiHandler = nextApp.getRequestHandler();
nextApp.prepare().then(async () => {
    const app = express();
    const server = createServer(app);

    
    app.all("*", (req:any, res:any) => NextHandler(req, res));

    server.listen(port, () => {
        console.log(`Server is ready and listening on ${port}.`);
    })
})