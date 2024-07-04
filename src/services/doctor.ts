import { formatDatetime, parseDate } from "@openmrs/esm-framework";
import Room from "../models/Room";
import { getOpencareRepository } from "../repositories/Opencare";
import OpencareRepository from "../repositories/Opencare/repository";
import { getRoomRepository } from "../repositories/Room";
import RoomRepository from "../repositories/Room/repository";
import env from "../repositories/env";
import BaseService from "./base";

export enum AppointmentTypes {
    UPCOMING = 0,
    TODAY = 1,
    PAST = 2,
}

class DoctorService {
    static instance: DoctorService | null = null;

    room_rep: RoomRepository;
    opencare_rep: OpencareRepository;

    constructor() {
        this.room_rep = getRoomRepository("good");
        this.opencare_rep = getOpencareRepository('good')
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
     * get the demand in process
     * @param istoday today boolean
     * @returns 
     */
    async getDemands(istoday = false): Promise<Array<any>> {
        try {
            return await this.opencare_rep.getDemands().then(demands => {
                return demands.map((demand) => {
                    return {
                        ...demand,
                        date: formatDatetime(parseDate(demand.date), {
                            mode: "wide",
                        }),
                    };
                })
            });
        } catch (error) {
            console.log((error));
            return null;
        }
    }

    /**
     * reject the demand in processing
     * @returns 
     */
    async rejectDemand(demand_id: string): Promise<any> {
        try {
            await this.opencare_rep.rejectDemand(demand_id)
            return true
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * validate the demand in processing
     * @returns 
     */
    async validateDemand(demand_id: string, doctor_id: string, startDate: Date = new Date(), duration: number = 30): Promise<any> {
        try {
            await this.opencare_rep.vaidateDemand(demand_id, doctor_id, startDate, duration)
            return true
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * get the appointments
     * @param patientUuid patient uuid
     * @returns 
     */
    async getAppointments(patientUuid: string): Promise<Map<number, Array<any>>> {
        try {
            const appointments = new Map<number, Array<any>>();
            appointments.set(AppointmentTypes.PAST, []);
            appointments.set(AppointmentTypes.TODAY, []);
            appointments.set(AppointmentTypes.UPCOMING, []);

            const res = await this.opencare_rep.getAppointments(patientUuid)

            const datenow = new Date()
            res.forEach((appointment, i) => {

                const date = new Date(appointment.startDateTime)

                if (date > datenow) {
                    appointments.get(AppointmentTypes.UPCOMING).push({
                        ...appointment,
                        appointmentTimeType: AppointmentTypes.UPCOMING
                    })
                } else {
                    if (date.getDay() == datenow.getDate() &&
                        date.getMonth() == datenow.getMonth() &&
                        date.getFullYear() == datenow.getFullYear()
                    ) {
                        appointments.get(AppointmentTypes.TODAY).push({
                            ...appointment,
                            appointmentTimeType: AppointmentTypes.TODAY
                        })
                    } else {
                        appointments.get(AppointmentTypes.PAST).push({
                            ...appointment,
                            appointmentTimeType: AppointmentTypes.PAST
                        })
                    }
                }
            })
            return appointments
        } catch (error) {
            return null;
        }
    }

    async getProviders(): Promise<Array<any>> {
        try {
            return await this.opencare_rep.getProviders();
        } catch (error) {
            console.log((error));
            return null;
        }
    }


    /**
     * create a room for the digital consultation for a patient
     * @param doctor_id doctor id
     * @param patient_id patient id
     * @returns 
     */
    async createRoom(doctor_id: string, patient_id: string, patient_name: string): Promise<Room | null> {
        try {
            const room = await this.room_rep.createRoom(`${doctor_id}#${patient_id}`);
            await this.room_rep.addRoomParticipant(doctor_id, room.token);
            await this.addPatient(patient_id, patient_name, room);
            return room;
        } catch (error) {
            return null;
        }
    }

    /**
     * add a patient on a room
     * @param patient_id patient id
     * @param patient_name patient name
     * @param room room for the patient
     */
    async addPatient(patient_id: string, patient_name: string, room: Room): Promise<void> {
        try {
            const password = await this.room_rep.getPasswordUser(patient_id);
            await this.room_rep.createUser(patient_id, patient_name, password);
            await this.room_rep.addRoomParticipant(patient_id, room.token);

        } catch (error) { }
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
            const TALK_USER = env.TALK_USER
            const TALK_PASSWORD = env.TALK_PASSWORD
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
