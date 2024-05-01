import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useSession, userHasAccess } from "@openmrs/esm-framework";
import Room from "../../models/Room";
import { actions as doctorActions } from "../../privileges/doctor";
import JoinRoomButton from "./JoinRoomButton";
import CreateRoomButton from "./CreateRoomButton";
import BaseService from "../../services/base";
import DoctorService from "../../services/doctor";

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
  const doctorService = DoctorService.getInstance();
  const baseService = BaseService.getInstance();

  // get a current User Id
  const user = useSession().user;
  const hasPrivileges = userHasAccess(doctorActions, user);

  // const {isLoading,patientUuid,error} = usePatient(patientId);
  useEffect(() => {
    const fun = async () => {
      const userId = user.uuid;
      const res = await baseService.createUserForRoom(userId, userId);
      if (res) {
        await doctorService.getRelatedRoom(userId, patientId).then((room) => {
          setRoom(room);
        });
      }
    };
    fun();
    return () => {};
  }, []);

  return (
    <>
      {hasPrivileges ? (
        <p>...</p>
      ) : room ? (
        <JoinRoomButton callback={callback} room={room} />
      ) : (
        <CreateRoomButton
          callback={(room: Room | null) => {
            setRoom(room);
          }}
          patientId={patientId}
          userId={user.person.uuid}
        />
      )}
    </>
  );
};

export default RoomButton;
