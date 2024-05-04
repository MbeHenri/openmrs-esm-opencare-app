import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useSession, userHasAccess } from "@openmrs/esm-framework";
import Room from "../../models/Room";
//import { actions as doctorActions } from "../../privileges/doctor";
import CreateRoomButton from "./CreateRoomButton";
import DoctorService from "../../services/doctor";
import { Link } from "react-router-dom";
import { Button } from "@carbon/react";

interface Props {
  patientId: string;
  patientName: string;
}

const RoomButton: React.FC<Props> = ({ patientId = "", patientName = "" }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const doctorService = DoctorService.getInstance();

  // get a current User Id
  const user = useSession().user;
  // const hasPrivileges = userHasAccess(doctorActions, user);
  const hasPrivileges = useMemo(() => true, []);

  // const {isLoading,patientUuid,error} = usePatient(patientId);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fun = async () => {
      if (hasPrivileges) {
        const userId = user.uuid;
        await doctorService.getRelatedRoom(userId, patientId).then((room) => {
          setRoom(room);
          setLoading(false);
        });
      }
    };
    fun();
    return () => {};
  }, []);

  return (
    <>
      {hasPrivileges ? (
        loading ? (
          <Button>Loading...</Button>
        ) : room ? (
          <Link to={"/meeting/" + room.token}>
            <Button>Joindre</Button>
          </Link>
        ) : (
          <CreateRoomButton
            callback={(room: Room | null) => {
              setRoom(room);
            }}
            patientId={patientId}
            patientName={patientName}
            userId={user.uuid}
          />
        )
      ) : (
        <p> out </p>
      )}
    </>
  );
};

export default RoomButton;
