import { createServer } from "http";

import express from "express";
import next, { NextApiHandler } from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.NODE_ENV || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev });
const NextHandler: NextApiHandler = nextApp.getRequestHandler();
nextApp.prepare().then(async () => {
    const app = express();
    const server = createServer(app);

    const io = new Server<clientToServerEvents, serverToClientEvents>(server);

    app.get("/health",async (_, res) => {
        console.log("healthy");
    })

    io.on("connection", (socket) => {
        console.log("Connection");
        
        socket.on("draw", (moves, options) => {
            console.log("drawing");
            socket.broadcast.emit("socket_draw", moves, options);
        })

        socket.on("disconnect", () => {
            console.log("client disconnected!");
            
        })
    })


    
    app.all("*", (req:any, res:any) => NextHandler(req, res));

    server.listen(port, () => {
        console.log(`Server is ready and listening on ${port}.`);
    })
})