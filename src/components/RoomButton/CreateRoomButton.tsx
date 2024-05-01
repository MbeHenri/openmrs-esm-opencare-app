import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { Button } from "@carbon/react";
import DoctorService from "../../services/doctor";

interface Props {
  patientId: string;
  userId: string;
  callback: Function;
}

const CreateRoomButton: React.FC<Props> = ({ patientId, callback, userId }) => {
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => DoctorService.getInstance(), []);
  const handleClick = useCallback(async () => {
    setLoading(true);
    await service.createRoom(userId, patientId).then((room) => callback(room));
    setLoading(false);
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
