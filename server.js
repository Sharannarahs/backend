import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


//create Express app and HTTP server

const app = express(); //app is a function (middleware)
const server = http.createServer(app) // socket.io supports http // created from NodeJs and wraps our Express app

//Initiliaze socket.io server

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});




// Store online users

export const userSocketMap = {}; //in the form of { userId: socketId } // object used to store which users are currently online // socketId: the unique ID assigned by Socket.IO for the user's active connection. //This object tracks which user is connected to which socket (browser tab or device).

// socket.io connection handler

io.on("connection" , (socket) =>{
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if(userId) userSocketMap[userId] = socket.id;   // Broadcasts the list of online users to all clients.
    

    // Emit online users to all connected client
    // Events :
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit() Send data from the server to the client or From the client to the server.



    socket.on("disconnect", ()=>{
        console.log("User Disconnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    })

})

// Middleware setup

/* Input (Request body):
This is about what the client sends to the server.

If the client sends a JSON body like:

json
Copy code
{
  "username": "john",
  "password": "1234"
}
Then express.json() parses this into a usable JavaScript object in req.body.

🔹 Output (Response):
You can send JSON back to the client using:

js
Copy code
res.json({ success: true, message: "User created" })
But that's not related to express.json() — it’s just a feature of res.json() from Express.
*/

//all the req to this server will be passed using json method
//4mb of images uploaded

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies or Authorization headers if needed
}));



app.use("/api/status", (req, res) => res.send("Server is live"))//is a route handler in Express that defines a simple HTTP endpoint. we use thit url to see the server statue
//http://localhost:5000/api/status

/*If someone makes an HTTP request to:

bash
Copy code
GET http://localhost:<your-port>/api/status
They will receive this response:

pgsql
Copy code
Server is live
*/

app.use("/api/auth", userRouter);  // POST /api/auth/signup  //for users end point //This line mounts the userRouter to the Express app, prefixing all routes inside it with /api/auth.
app.use("/api/messages", messageRouter);

// Connect to MongoDB

await connectDB()

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));