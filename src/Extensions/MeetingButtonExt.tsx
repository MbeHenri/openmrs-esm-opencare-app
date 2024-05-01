import React, { useCallback } from "react";
import { navigate, usePatient } from "@openmrs/esm-framework";
import RoomButton from "../components/RoomButton";
import { Button } from "@carbon/react";

interface Props {}

const MeetingButtonExt: React.FC<Props> = ({}) => {
  const { isLoading, patientUuid, error } = usePatient();

  const handleClick = useCallback(() => {
    const basename = window.getOpenmrsSpaBase() + "opencare";
    navigate({
      to: basename + "/meeting/" + patientUuid,
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <Button>...</Button>
      ) : error ? (
        <></>
      ) : (
        <Button onClick={handleClick}> Go Meeting </Button>
      )}
    </>
  );
};

export default MeetingButtonExt;
