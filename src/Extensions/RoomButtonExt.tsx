import React from "react";
import { usePatient } from "@openmrs/esm-framework";
import RoomButton from "../components/RoomButton";

interface Props {}

const RoomButtonExt: React.FC<Props> = ({}) => {
  const { isLoading, patientUuid, error } = usePatient();
  return (
    <>
      {isLoading ? (
        <p>...</p>
      ) : error ? (
        <></>
      ) : (
        <RoomButton patientId={patientUuid} />
      )}
    </>
  );
};

export default RoomButtonExt;