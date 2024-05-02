import React from "react";
import { usePatient } from "@openmrs/esm-framework";
import RoomButton from "../components/RoomButton";

interface Props {}

const RoomButtonExt: React.FC<Props> = ({}) => {
  const { isLoading, patient, patientUuid, error } = usePatient();
  return (
    <>
      {isLoading ? (
        <p>...</p>
      ) : error ? (
        <></>
      ) : (
        <RoomButton
          patientId={patientUuid}
          patientName={patient.name[0].given[0] + " " + patient.name[0].family}
        />
      )}
    </>
  );
};

export default RoomButtonExt;
