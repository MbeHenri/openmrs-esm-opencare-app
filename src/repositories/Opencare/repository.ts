

class OpencareRepository {

    async getDemands(): Promise<Array<any>> {
        return []
    }

    async getAppointments(patientUuid: string): Promise<Array<any>> {

        return []
    }

    async rejectDemand(demand_id: string): Promise<void> {

    }

    async vaidateDemand(demand_id: string, doctor_id: string, startDate: Date = new Date(), duration: number = 30): Promise<void> {

    }

    async getProviders(): Promise<Array<any>> {
        return []
    }

}

export default OpencareRepository;
