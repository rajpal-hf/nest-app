// // import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
// // import { Socket } from "socket.io";

// // @WebSocketGateway(3002, )
// // export class ChatGateWay {
// // 	@SubscribeMessage("newMessage")
// // 	handleNewMessage(client: Socket, msg : any) {

// // 		console.log("msggggggggggggggggg",msg)
// // 		client.emit('reply', 'reply from server - Hi')
// // 	}
// // }



// import {
// 	WebSocketGateway,
// 	WebSocketServer,
// 	SubscribeMessage,
// 	MessageBody,
// 	ConnectedSocket,
// } from '@nestjs/websockets';
// import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { WebSocket } from 'ws';

// interface ClientInfo {
// 	socket: WebSocket;
// 	roomId?: string;
// }

// let UserConnectionId = 0;

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection {
// 	@WebSocketServer()
// 	server: any; // any Or type can be Socket

// 	private clients: ClientInfo[] = [];

// 	handleConnection(client: WebSocket) {
// 		UserConnectionId = UserConnectionId + 1;
// 		console.log('Client connected #',UserConnectionId);
// 		this.clients.push({ socket: client });
// 	}
// 			// for delete connectionn which are disconnected
// 	// handleDisconnect(client: WebSocket) {
// 	// 	console.log('Client disconnected');
// 	// 	this.clients = this.clients.filter((c) => c.socket !== client);
// 	// }

// 	@SubscribeMessage('joinRoom')
// 	handleJoinRoom(
// 		@MessageBody() data: { roomId: string },
// 		@ConnectedSocket() client: WebSocket,
// 	) {
// 		const clientInfo = this.clients.find((c) => c.socket === client);
// 		if (clientInfo) {
// 			clientInfo.roomId = data.roomId;
// 			client.send(JSON.stringify({ event: 'joined', roomId: data.roomId }));
// 		}
// 	}

// 	@SubscribeMessage('message')
// 	handleMessage(
// 		@MessageBody() data: { roomId: string; message: string; user: string },
// 		@ConnectedSocket() client: WebSocket,
// 	) {
// 		const { roomId, message, user } = data;
// 		console.log(`[${roomId}] ${user}: ${message}`);

// 		// broadcast to everyone in same room
// 		this.clients.forEach((c) => {
// 			if (c.roomId === roomId) {
// 				c.socket.send(
// 					JSON.stringify({
// 						event: 'message',
// 						roomId,
// 						user,
// 						message,
// 					}),
// 				);
// 			}
// 		});
// 	}
// }
import {
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

interface ClientInfo {
	socket: WebSocket;
	roomId?: string;
	user?: string;
}

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private clients: ClientInfo[] = [];

	handleConnection(client: WebSocket) {
		console.log('Client connected');
		this.clients.push({ socket: client });

		client.on('message', (msg: any) => {
			let data: any;
			try {
				data = JSON.parse(msg.toString());
			} catch {
				console.error('Invalid message:', msg.toString());
				return;
			}

			switch (data.event) {
				case 'joinRoom':
					this.handleJoinRoom(client, data);
					break;
				case 'message':
					this.handleChatMessage(client, data);
					break;
				default:
					client.send(JSON.stringify({ event: 'error', message: 'Unknown event' }));
			}
		});

		client.on('close', () => this.handleDisconnect(client));
	}

	handleDisconnect(client: WebSocket) {
		this.clients = this.clients.filter(c => c.socket !== client);
		console.log('Client disconnected');
	}

	private handleJoinRoom(client: WebSocket, data: any) {
		const { roomId, user } = data.data;

	
		const existingClient = this.clients.find(c => c.socket === client);


		// console.log("existingClienttttttttttttttttttt" , existingClient)
		if (existingClient) {
			existingClient.roomId = roomId;
			existingClient.user = user;
		}

		console.log(`qqqqqqqqqqqqqqqqqqqq -------------->   User ${user} joined room ${roomId}`);
		client.send(JSON.stringify({ event: 'joined', roomId }));
	}

	private handleChatMessage(client: WebSocket, data: any) {
		const { roomId, message, user } = data;

		if (!roomId || !message) {
			client.send(JSON.stringify({ event: 'error', message: 'Invalid message data' }));
			return;
		}

		console.log(`[${roomId}] ${user}: ${message}`);

		this.clients.forEach(c => {
			if (c.roomId === roomId && c.socket.readyState === WebSocket.OPEN) {
				// Send message to everyone in the same room, including sender
				c.socket.send(
					JSON.stringify({
						event: 'message',
						roomId,
						user,
						message,
					}),
				);
			}
		});
	}
}


