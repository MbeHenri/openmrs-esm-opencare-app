import React, { useMemo } from "react";
import { usePatient, useSession, userHasAccess } from "@openmrs/esm-framework";
import RoomButton from "../components/RoomButton";
import { Button } from "@carbon/react";
import { actions } from "../privileges/doctor";
import RestrictComponent from "../components/RestrictComponent";

interface Props {}

const RoomButtonExt: React.FC<Props> = ({}) => {
  const { isLoading, patient, patientUuid, error } = usePatient();

  return (
    <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
      <RestrictComponent>
        {isLoading ? (
          <Button>...</Button>
        ) : error ? (
          <Button></Button>
        ) : (
          <RoomButton
            patientId={patientUuid}
            patientName={
              patient.name[0].given[0] + " " + patient.name[0].family
            }
          />
        )}
      </RestrictComponent>
    </div>
  );
};

export default RoomButtonExt;
