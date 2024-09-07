/* eslint-disable @typescript-eslint/no-empty-function */

class OpencareRepository {
  async getDemands(): Promise<Array<any>> {
    return [];
  }

  async getAppointments(
    patientUuid: string,
    doctor?: string
  ): Promise<Array<any>> {
    return [];
  }

  async rejectDemand(demand_id: string): Promise<void> {}

  async vaidateDemand(
    demand_id: string,
    doctor_id: string,
    startDate: Date = new Date(),
    duration = 30
  ): Promise<void> {}

  async getProviders(): Promise<Array<any>> {
    return [];
  }

  // must be different for production for the duration of the appointment
  async getTokenNextcloud(username: string): Promise<any> {
    return "TALK_PASSWORD";
  }
}

export default OpencareRepository;
