import http from "http";
import express from "express";
import { matchesRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the Express server!" });
});

app.use("/matches", matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

// Start server
server.listen(PORT, HOST, () => {
	const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
	console.log(`Server is running on ${baseUrl}`);
	console.log(`WebSockt server is running on ${baseUrl.replace("http", "ws")}/ws`);
});
