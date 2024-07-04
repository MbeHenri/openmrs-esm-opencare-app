import { BadResponse } from "../errors";
import env from "../env";
import OpencareRepository from "./repository";


class ProdOpencareRepository extends OpencareRepository {

    async getDemands(): Promise<Array<any>> {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        const demandProgressStatus = "2"
        return await fetch(`${env.API_BASE_URL()}/demand?status=${demandProgressStatus}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recupérer les démandes (${response.status})`, "Opencare")
            }).then(({ results }) => {
                const res: Array<any> = results
                return res
            })

    }

    async getAppointments(patientUuid: string): Promise<Array<any>> {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        return await fetch(`${env.API_BASE_URL()}/patient/${patientUuid}/appointment`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recupérer les rencontres (${response.status})`, "Opencare")
            }).then(({ results }) => {
                const res: Array<any> = results
                return res.map((appointment) => {
                    return {
                        uuid: appointment.uuid,
                        startDateTime: appointment.startDateTime,
                        location: "",
                        service: appointment.service,
                        status: appointment.statusProgress,
                        appointmentKind: "Scheduled",
                        comments: "",
                        linkRoom: appointment.linkRoom,
                        patientUuid,

                    }
                })
            })
    }


    async rejectDemand(demand_id: string): Promise<void> {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders
        };
        await fetch(`${env.API_BASE_URL()}/demand/${demand_id}/reject`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de rejeter la demande (${response.status})`, "Opencare")
            })
    }

    async vaidateDemand(demand_id: string, doctor_id: string, startDate: Date = new Date(), duration: number = 30): Promise<void> {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "doctor_id": doctor_id,
            "duration": duration,
            "date_meeting": startDate.toISOString(),
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw
        };

        await fetch(`${env.API_BASE_URL()}/demand/${demand_id}/validate`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de valider la demande (${response.status})`, "Opencare")
            })
    }

    async getProviders(): Promise<Array<any>> {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json,");
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Authorization", `Basic ${TALK_BASE64}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        return await fetch(`${env.API_BASE_URL()}/doctor`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new BadResponse(`Impossible de recupérer les rencontres (${response.status})`, "Opencare")
            }).then(({ results }) => {
                const res: Array<any> = results
                return res.map((doctor) => {
                    return {
                        id: doctor.uuid,
                        name: doctor.person.display,
                    }
                })
            })
    }

}

export default ProdOpencareRepository;