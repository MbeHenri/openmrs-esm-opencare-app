import { formatDatetime, parseDate } from "@openmrs/esm-framework";
import { getOpencareRepository } from "../repositories/Opencare";
import OpencareRepository from "../repositories/Opencare/repository";

export enum AppointmentTypes {
    UPCOMING = 0,
    TODAY = 1,
    PAST = 2,
}

class DoctorService {
    static instance: DoctorService | null = null;

    opencare_rep: OpencareRepository;

    constructor() {
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
}

export default DoctorService;
