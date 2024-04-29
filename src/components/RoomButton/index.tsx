import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { usePatient, useSession, userHasAccess } from "@openmrs/esm-framework";
import Room from "../../models/Room";
import { actions as doctorActions } from "../../privileges/doctor";
import { TALK_BASE64, TALK_USER } from "../../repositories/env";
import DoctorService from "../../services/doctor";
import JoinRoomButton from "./JoinRoomButton";
import CreateRoomButton from "./CreateRoomButton";

interface Props {
  patientId: string | null;
  callback?: Function;
}

const RoomButton: React.FC<Props> = ({
  patientId = null,
  callback = (url: string) => {
    window.open(url);
  },
}) => {
  const [room, setRoom] = useState<Room | null>(null);

  const service = DoctorService.getInstance();

  // get a current User Id
  const user = useSession().user;
  const hasPrivileges = userHasAccess(doctorActions, user);

  // const {isLoading,patientUuid,error} = usePatient(patientId);
  useEffect(() => {
    const fun = async () => {
      try {
        await service
          .getRelatedRoom(user.person.uuid, patientId)
          .then((room) => {
            setRoom(room);
          });
      } catch (error) {}
    };
    fun();
    return () => {};
  }, []);

  return (
    <>
      {hasPrivileges ? (
        room ? (
          <JoinRoomButton callback={callback} room={room} />
        ) : (
          <CreateRoomButton
            callback={(room: Room) => {
              setRoom(room);
            }}
            patientId={patientId}
            userId={user.person.uuid}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default RoomButton;
