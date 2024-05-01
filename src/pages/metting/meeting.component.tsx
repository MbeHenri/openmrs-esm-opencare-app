import React, { useState } from "react";
import classnames from "classnames";
import RoomButton from "../../components/RoomButton";
import { useSession } from "@openmrs/esm-framework";
import { useParams } from "react-router";
import { Button } from "@carbon/react";
import { Link } from "react-router-dom";

export function Meeting(): React.JSX.Element {
  //const [url, setUrl] = useState<string | null>(null);

  const cd = useParams();

  // get a current User Id
  const user = useSession().user;

  const patients = [
    {
      name: "Sarah",
      uuid: "66c87fe5-6f31-46d8-bcb3-3e77c99563d0",
      Identifier: "10EEnn",
    },
  ];
  const basename = window.getOpenmrsSpaBase() + "opencare";

  return (
    <main className={classnames("omrs-main-content")}>
      <h3> Patients </h3>

      {/* Liste des patient */}
      <div style={{ display: "flex", flexWrap: "wrap", margin: "4rem" }}>
        {patients.map((value) => {
          return (
            <>
              <p style={{ marginRight: "1rem" }}>{value.Identifier}</p>
              <p style={{ marginRight: "1rem" }}>{value.name}</p>
              <Button>
                <Link to={basename + "/meeting/" + value.uuid} />
              </Button>
            </>
          );
        })}

        {/* <RoomButton
          patientId={"66c87fe5-6f31-46d8-bcb3-3e77c99563d0"}
          callback={(url: string) => {
            setUrl(url);
          }}
        /> */}
      </div>
    </main>
  );
}
