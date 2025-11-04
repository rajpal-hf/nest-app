import {
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';						
import { ChatService } from './chat.service';

interface ClientInfo {
	socket: WebSocket;
	roomId?: string;
	user?: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private clients: ClientInfo[] = [];

	constructor(private readonly chatService: ChatService) { }

	handleConnection(client: WebSocket) {
		this.clients.push({ socket: client });
		client.on('message', (msg) => this.onClientMessage(client, msg));
		client.on('close', () => this.handleDisconnect(client));
	}

	private async onClientMessage(client: WebSocket, msg: any) {
		let data;
		try {
			data = JSON.parse(msg.toString());
		} catch {
			client.send(JSON.stringify({ event: 'error', message: 'Invalid JSON' }));
			return;
		}

		switch (data.event) {
			case 'joinRoom':
				this.handleJoinRoom(client, data.data);
				break;
			case 'privateMessage':
				await this.handlePrivateMessage(client, data.data);
				break;
			case 'groupMessage':
				await this.handleGroupMessage(client, data.data);
				break;
			default:
				client.send(JSON.stringify({ event: 'error', message: 'Unknown event' }));
		}
	}

	private handleJoinRoom(client: WebSocket, data: any) {
		const { roomId, user } = data;
		const existingClient = this.clients.find((c) => c.socket === client);
		if (existingClient) {
			existingClient.roomId = roomId;
			existingClient.user = user;
		}
		client.send(JSON.stringify({ event: 'joined', roomId }));
	}

	private async handlePrivateMessage(client: WebSocket, data: any) {
		const { senderId, receiverId, content } = data;
		const savedMessage = await this.chatService.sendPrivateMessage(senderId, {
			receiverId,
			content,
		});

		this.broadcast([senderId, receiverId], 'privateMessage', savedMessage);
	}

	private async handleGroupMessage(client: WebSocket, data: any) {
		const { senderId, roomId, content } = data;
		const savedMessage = await this.chatService.sendGroupMessage(
			senderId,
			roomId,
			content,
		);

		this.broadcastToRoom(roomId, 'groupMessage', savedMessage);
	}

	private broadcast(userIds: string[], event: string, message: any) {
		this.clients.forEach((c) => {
			if (userIds.includes(c.user!) && c.socket.readyState === WebSocket.OPEN) {
				c.socket.send(JSON.stringify({ event, data: message }));
			}
		});
	}

	private broadcastToRoom(roomId: string, event: string, message: any) {
		this.clients.forEach((c) => {
			if (c.roomId === roomId && c.socket.readyState === WebSocket.OPEN) {
				c.socket.send(JSON.stringify({ event, data: message }));
			}
		});
	}

	handleDisconnect(client: WebSocket) {
		this.clients = this.clients.filter((c) => c.socket !== client);
	}
}
