	import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
	import { InjectModel } from '@nestjs/mongoose';
	import { Model } from 'mongoose';
	import { Room, RoomDocument } from './schema/room.schema';
	import { Message, MessageDocument } from './schema/message.schema';
	import { User, UserDocument } from 'src/auth/schema/auth.schema';
	import { CreateMessageDto } from './dto';
	import { RoomStatus } from 'src/constants';

	@Injectable()
	export class ChatService {
		constructor(
			@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
			@InjectModel(Message.name) private messageModel: Model<MessageDocument>,
			@InjectModel(User.name) private userModel: Model<UserDocument>,
		) { }

		async getOrCreatePrivateRoom(userId1: string, userId2: string): Promise<RoomDocument> {
			let room = await this.roomModel.findOne({
				roomStatus: RoomStatus.PRIVATE,
				members: { $all: [userId1, userId2], $size: 2 },
			});

			if (!room) {
				room = await this.roomModel.create({
					name: 'private',
					roomStatus: RoomStatus.PRIVATE,
					members: [userId1, userId2],
				});
			}

			return room;
		}

		async sendPrivateMessage(senderId: string, dto: CreateMessageDto) {
			try {
				const { receiverId, content } = dto;

				const sender = await this.userModel.findById(senderId);
				const receiver = await this.userModel.findById(receiverId);

				if (!sender || !receiver) {
					throw new NotFoundException('Sender or receiver not found');
				}

				const room = await this.getOrCreatePrivateRoom(senderId, receiverId);

				const message = await this.messageModel.create({
					content,
					sender: senderId,
					room: room._id,
					status: 'sent',
					isBroadcast: false,
				});

				return message.populate('sender', 'name email avatar');
			} catch (err) {
				console.error('Error in sendPrivateMessage:', err);
				throw err instanceof HttpException ? err : new HttpException('Internal server error', 500);
			}
		}

		/**
		 * Get chat history between two users
		 */
		async getPrivateMessages(userId1: string, userId2: string) {

			try {

				const room = await this.roomModel.findOne({
					roomStatus: RoomStatus.PRIVATE,
					members: { $all: [userId1, userId2], $size: 2 },
				});

				if (!room) return [];

				return this.messageModel
					.find({ room: room._id })
					.populate('sender', 'name email avatar')
					.sort({ createdAt: 1 });
			
			} catch (error) {
				console.log("Error in getPrivateMessage", error)
				throw new error instanceof HttpException ? error : new HttpException("Internal server error ",500)
			}
		
		}


		// chat.service.ts
		async createGroupRoom(name: string, creatorId: string, members: string[] = []) {
			const creator = await this.userModel.findById(creatorId);
			if (!creator) throw new NotFoundException('Creator not found');

			const room = await this.roomModel.create({
				name,
				roomStatus: RoomStatus.GROUP,
				members: [creatorId, ...members],
				createdBy: creatorId,
			});

			return room.populate('members', 'name email avatar');
		}

		async joinGroupRoom(roomId: string, userId: string) {
			const room = await this.roomModel.findById(roomId);
			if (!room) throw new NotFoundException('Room not found');

			if (!room.members.includes(userId as any)) {
				room.members.push(userId as any);
				await room.save();
			}

			return room.populate('members', 'name email avatar');
		}

		async sendGroupMessage(senderId: string, roomId: string, content: string) {
			const room = await this.roomModel.findById(roomId);
			if (!room || room.roomStatus !== RoomStatus.GROUP)
				throw new NotFoundException('Group room not found');

			const message = await this.messageModel.create({
				content,
				sender: senderId,
				room: room._id,
				status: 'sent',
				isBroadcast: true,
			});

			return message.populate('sender', 'name email avatar');
		}

		async getGroupMessages(roomId: string) {
			return this.messageModel
				.find({ room: roomId })
				.populate('sender', 'name email avatar')
				.sort({ createdAt: 1 });
		}

	}