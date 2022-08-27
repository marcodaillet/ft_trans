import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Chat, ChatUser } from './chat.entity';
import { comparePassword, encodePassword } from './utils/bcrypt';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private readonly ChatRepository: Repository<Chat>,
        @InjectRepository(ChatUser) private readonly ChatUserRepository: Repository<ChatUser>,
       
       ) {}
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ deb get @@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    async getChat(){
        let res = await this.ChatRepository.find();
        return (res);
    }
    async getChatById(id:number){
        let res = await this.ChatRepository.findOneBy({
            id:id
        });
        return (res);
    }

    async getChatByuserId(id:number){
        let res = await this.ChatRepository.findOneBy({
            id:id
        });
        return (res);
    }

    async getChatUser(){
        let res = await this.ChatUserRepository.find();
        return (res);
    }
    async getChatUserByChatId(id:number){
        let res = await this.ChatUserRepository.find();
        let ret: number[] = [];
        res.map((chat: ChatUser) => {
            if (chat.chatId === id)
                ret.push(chat.userId);
        })
        return (ret);
    }

    async getChatUserByUserId(id:number){
        let res = await this.ChatUserRepository.find();
        let ret: number[] = [];
        res.map((chat: ChatUser) => {
            if (chat.userId === id)
                ret.push(chat.chatId);
        })
        return (ret);
    }

    async getChatAdminByChatId(id:number){
        let res = await this.ChatUserRepository.findOne({where: { chatId: id, userType: 0}});
        return (res);
    }

    async getChatAdminByAdminId(id:number){
        let res = await this.ChatUserRepository.findOne({where: { userId: id, userType: 0} });
        return (res);
    }

    async isAdmin(chanId: number, userId: number) {
        let res = await this.ChatUserRepository.findOne({where: {userId: userId, chatId: chanId}});
        if (res)
            return (true);
        else
            return (false);
    }

    async getUserType(chanId: number, userId: number) {
        let res = await this.ChatUserRepository.findOne({where: {userId: userId, chatId: chanId}});
        return (res.userType);
    }
    
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ fin get @@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ deb mouv @@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    async mouvNameChatById(id:number, name:string){
        let res = await this.ChatRepository.findOneBy({
            id: id
        });
        res.name = name;
        await this.ChatRepository.save(res);
        return (res);
    }

    async mouvIsPrivateChatById(id:number, isPrivate:boolean){
        console.log("We come here with " + isPrivate)
        let res = await this.ChatRepository.findOneBy({
            id: id
        });
        res.isPrivate = isPrivate;
        await this.ChatRepository.save(res);
        return (res);
    }

    async mouvIsDirectConvChatById(id:number, isDirectConv:boolean){
        let res = await this.ChatRepository.findOneBy({
            id: id
        });
        res.isDirectConv = isDirectConv;
        await this.ChatRepository.save(res);
        return (res);
    }

    async mouvPasswordChatById(id:number, password:string){
        let res = await this.ChatRepository.findOneBy({
            id: id
        });
        res.password = encodePassword(password);
        await this.ChatRepository.save(res);
        return (res);
    }

    async checkPassword(id: number, password: string) {
        let res = await this.ChatRepository.findOneBy({
            id: id
        });
        return (comparePassword(password, res.password))
    }


    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ fin mouv @@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ deb insert @@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    async insertChat(name, isPrivate, isDirectConv, password){
        let res = new Chat();
        res.name = name;
        res.isPrivate = isPrivate;
        res.isDirectConv = isDirectConv;
        res.password = encodePassword(password);
        await this.ChatRepository.save(res);
        return (res);
    }

    async insertChatUser(chatId:number, userId:number, userType:number)
    {
        let chatUser = new ChatUser();
        chatUser.chatId = chatId;
        chatUser.userId = userId;
        chatUser.userType = userType
        await this.ChatUserRepository.save(chatUser);
        return (chatUser);
    }

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ fin insert @@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ deb delete @@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    async deleteChat(id:number)
    {
        let res = await this.ChatRepository.findOneBy({
            id : id
        })
        await this.ChatRepository.save(res);
    }

    async deletChatUserByUserId(userId:number)
    {
        let res = await this.ChatUserRepository.findOneBy({
            userId: userId
        })
        await this.ChatUserRepository.remove(res);
    }

    async deletChatUserByChatId(chatId:number)
    {
        let res = await this.ChatUserRepository.findOneBy({
            chatId: chatId
        })
        await this.ChatUserRepository.remove(res);
    }

    async deleteUserFromChat(chanId: number, userId: number) {
        let res = await this.ChatUserRepository.findOne({where: {chatId: chanId, userId: userId}});
        if (res)
            await this.ChatUserRepository.remove(res);
    }

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@ fin delerte @@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    async updateUserStatus(userId: number, status: number, chanId: number) {
        let allUsers = await this.ChatUserRepository.find();
        allUsers.forEach((user: ChatUser) => {
            if (user.userId === userId && user.chatId === chanId) {
                user.userType = status;
            }
        })
        this.ChatUserRepository.save(allUsers);
    }

}