import Room from "../models/Room";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import { TALK_HOST, TALK_PORT } from "../repositories/env";

class BaseService {
    static instance: BaseService | null = null;

    room_rep: RoomRepository;

    constructor() {
        this.room_rep = getRoomRepository();
    }

    /**
     * 
     * @returns patient service
     */
    static getInstance(): BaseService {
        if (BaseService.instance) {
            return BaseService.instance;
        } else {
            BaseService.instance = new BaseService();
            return BaseService.instance;
        }

    }
    
    /**
    * get a room link
    * @param room room
    * @returns 
    */
    static async getRoomURL(room: Room): Promise<string> {
        return `http://${TALK_HOST}:${TALK_PORT}/call/${room.token}`;
    }
   
    /**
     * 
     * @param user_id O3 Identifier of a user
     * @param name displayName name for account
     * @returns 
     */
    async createUserForRoom(user_id: string, name: string): Promise<void> {
        const password = await this.room_rep.getPasswordUser(user_id);
        return await this.room_rep.createUser(user_id, name, password);
    }

}

export default BaseService;
