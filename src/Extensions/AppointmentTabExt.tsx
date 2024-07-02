import React from "react";
import PatientAppointmentsBase from "../components/Appointment";
import { usePatient } from "@openmrs/esm-framework";

interface Props {}

const AppointmentTabExt: React.FC<Props> = ({}) => {
  const { isLoading, patientUuid, error } = usePatient();

  return (
    <div>
      {isLoading ? (
        <span>...</span>
      ) : error ? (
        <span></span>
      ) : (
        <PatientAppointmentsBase patientUuid={patientUuid} />
      )}
    </div>
  );
};

export default AppointmentTabExt;
