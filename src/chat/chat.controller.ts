import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	/**
	 * Send a private message
	 */
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Post('private')
	async sendPrivateMessage(@Req() req :any, @Body() dto: CreateMessageDto) {
		const senderId = req.user.id ; 
		return this.chatService.sendPrivateMessage(senderId, dto);
	}


	@UseGuards(AuthGuard)
		@ApiBearerAuth()
	@Get('private/:receiverId')
	async getPrivateMessages(@Req() req :any, @Param('receiverId') receiverId: string) {
		const senderId = req.user.id;
		return this.chatService.getPrivateMessages(senderId, receiverId);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Post('group')
	async createGroup(
		@Req() req: any,
		@Body() body: { name: string; members?: string[] },
	) {
		return this.chatService.createGroupRoom(body.name, req.user.id, body.members);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Post('group/join/:roomId')
	async joinGroup(@Req() req: any, @Param('roomId') roomId: string) {
		return this.chatService.joinGroupRoom(roomId, req.user.id);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Post('group/:roomId/message')
	async sendGroupMessage(
		@Req() req: any,
		@Param('roomId') roomId: string,
		@Body() body: { content: string },
	) {
		return this.chatService.sendGroupMessage(req.user.id, roomId, body.content);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get('group/:roomId/messages')
	async getGroupMessages(@Param('roomId') roomId: string) {
		return this.chatService.getGroupMessages(roomId);
	}

}
