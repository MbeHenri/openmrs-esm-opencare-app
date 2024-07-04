import React from "react";
import styles from "./index.scss";

interface MeetIframeProps {
  url: string;
}
export const MeetIframe: React.FC<MeetIframeProps> = ({ url }) => {
  return (
    <div className={styles.contentViewWrapper}>
      <iframe
        title="Web Meeting"
        src={url}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
