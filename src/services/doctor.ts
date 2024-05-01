import Room from "../models/Room";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import { TALK_PASSWORD, TALK_USER } from "../repositories/env";
import BaseService from "./base";

class DoctorService {
    static instance: DoctorService | null = null;

    room_rep: RoomRepository;

    constructor() {
        this.room_rep = getRoomRepository();
    }

    /**
     * 
     * @returns patient service
     */
    static getInstance(): DoctorService {
        if (DoctorService.instance) {
            return DoctorService.instance;
        } else {
            DoctorService.instance = new DoctorService();
            return DoctorService.instance;
        }

    }
    /**
     * create a room for the digital consultation for a patient
     * @param doctor_id doctor id
     * @param patient_id patient id
     * @returns 
     */
    async createRoom(doctor_id: string, patient_id: string): Promise<Room | null> {
        try {
            return await this.room_rep.createRoom(`${doctor_id}#${patient_id}`);
        } catch (error) {
            return null;
        }
    }


    /**
    * get a room link
    * @param room room
    * @returns 
    */
    async getRoomURL(room: Room): Promise<string> {
        return await BaseService.getRoomURL(room);
    }

    /**
     * get a room related to a patient and a doctor
     * @param doctor_id 
     * @param patient_id 
     * @returns 
     */
    async getRelatedRoom(doctor_id: string, patient_id: string): Promise<Room | null> {
        try {
            const rooms = await this.room_rep.getRelatedRooms(`${TALK_USER}`, `${TALK_PASSWORD}`);
            const room = rooms.find((element) => {
                return element.name === `${doctor_id}#${patient_id}`
            })
            return room ? room : null;
        } catch (error) {
            return null
        }
    }

}

export default DoctorService;
