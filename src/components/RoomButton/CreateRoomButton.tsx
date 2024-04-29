import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import DoctorService from "../../services/doctor";
import { Button } from "@carbon/react";

interface Props {
  patientId: string;
  userId: string;
  callback: Function;
}

const CreateRoomButton: React.FC<Props> = ({ patientId, callback, userId }) => {
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => DoctorService.getInstance(), []);
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      await service
        .createRoom(userId, patientId)
        .then((room) => callback(room))
        .then(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  }, [callback, patientId, service, userId]);

  return (
    <>
      {loading ? (
        <Button>Creating ...</Button>
      ) : (
        <Button onClick={handleClick}>Create Room</Button>
      )}
    </>
  );
};

export default CreateRoomButton;
