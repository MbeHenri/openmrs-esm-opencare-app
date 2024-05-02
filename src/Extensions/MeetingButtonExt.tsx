import React, { useCallback } from "react";
import { navigate, usePatient } from "@openmrs/esm-framework";
import RoomButton from "../components/RoomButton";
import { Button } from "@carbon/react";

interface Props {}

const MeetingButtonExt: React.FC<Props> = ({}) => {
  const { isLoading, patientUuid, error } = usePatient();

  const handleClick = useCallback(() => {
    // check if a current user have a access for join the consultation
    // get a uuid of a current user
    // get a related room between a current user with a patient
    // get a token and put it in a url
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
