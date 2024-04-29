import React, { useState } from "react";
import classnames from "classnames";
import RoomButton from "../../components/RoomButton";

export function Meeting(): React.JSX.Element {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <main className={classnames("omrs-main-content")}>
      <h3> Patients </h3>
      
      <div style={{ display: "flex", flexWrap: "wrap", margin: "4rem" }}>
        <p style={{ marginRight: "1rem"}}>John</p>
        <RoomButton
          patientId={"66c87fe5-6f31-46d8-bcb3-3e77c99563d0"}
          callback={(url: string) => {
            setUrl(url);
          }}
        />
      </div>
      {url ? (
        <iframe
          title="Web view Meeting"
          src={url}
          style={{ width: "100%", height: "500px" }}
        />
      ) : (
        <></>
      )}
    </main>
  );
}
