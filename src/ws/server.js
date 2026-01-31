import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload) {
	if (socket.readyState !== WebSocket.OPEN) return;

	socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
	for (const client of wss.clients) {
		if (client.readyState !== WebSocket.OPEN) continue;

		client.send(JSON.stringify(payload));
	}
}

export function attachWebSocketServer(server) {
	const wss = new WebSocketServer({
		server,
		path: "/ws",
		maxPayload: 1024 * 1024,
	});

	wss.on("connection", (socket) => {
		sendJson(socket, { type: "welcome" });
		console.log(`WebSocket client connected. Total clients: ${wss.clients.size}`);

		socket.on("error", console.error);

		socket.on("close", () => {
			console.log(`WebSocket client disconnected. Total clients: ${wss.clients.size}`);
		});
	});

	function broadcastMatchCreated(match) {
		broadcast(wss, { type: "match_created", data: match });
	}

	return { broadcastMatchCreated };
}
