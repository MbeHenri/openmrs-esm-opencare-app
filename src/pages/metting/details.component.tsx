import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { usePatient, useSession } from "@openmrs/esm-framework";
import { useParams } from "react-router-dom";
import DoctorService from "../../services/doctor";

export function DetailMeeting(): React.JSX.Element {
  const [url, setUrl] = useState<string | null>(null);

  const { patientId } = useParams();
  const { isLoading, patient, error } = usePatient(patientId);

  const service = useMemo(() => new DoctorService(), []);

  // get a current User Id
  const user = useSession().user;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const room = await service.getRelatedRoom(user.uuid, patientId);
      if (room) {
        await service.getRoomURL(room).then((url) => {
          setUrl(url);
        });
      }
      setLoading(false);
    };
    func();
    return () => {};
  }, []);

  return (
    <main className={classnames("omrs-main-content")}>
      {/* Espace de vue du patient */}

      <div>
        <h3> Patient </h3>
        {isLoading ? (
          <p>...</p>
        ) : error ? (
          <></>
        ) : (
          <p>{patient.identifier[0].value}</p>
        )}
      </div>

      {/* espace de la reunion */}
      <div>
        {loading ? (
          <p>...</p>
        ) : url ? (
          <iframe
            title="Web Meeting"
            src={url}
            style={{ width: "100%", height: "500px" }}
          />
        ) : (
          <p>rien</p>
        )}
      </div>
    </main>
  );
}