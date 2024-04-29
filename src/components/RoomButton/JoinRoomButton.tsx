import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import DoctorService from "../../services/doctor";
import Room from "../../models/Room";
import { Button } from "@carbon/react";

interface Props {
  room: Room;
  callback: Function;
}

const JoinRoomButton: React.FC<Props> = ({
  room,
  callback = (url: string) => {
    window.open(url);
  },
}) => {
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => DoctorService.getInstance(), []);

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);

      await service
        .getRoomURL(room)
        .then((url) => callback(url))
        .then(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  }, [callback, room, service]);

  return (
    <>
      {loading ? (
        <Button>Joining ...</Button>
      ) : (
        <Button onClick={handleClick}>Joining Room</Button>
      )}
    </>
  );
};

export default JoinRoomButton;
