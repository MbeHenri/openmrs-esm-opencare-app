import React from "react";
import classnames from "classnames";

export function Payment(): React.JSX.Element {
  const url = "https://www.youtube.com/embed/P-iiN0c2uic";
  return (
    <main className={classnames("omrs-main-content")}>
      <h3> Payment </h3>
      <iframe
        title="Web view Payment"
        src={url}
        style={{ width: "100%", height: "500px" }}
      />
    </main>
  );
}
