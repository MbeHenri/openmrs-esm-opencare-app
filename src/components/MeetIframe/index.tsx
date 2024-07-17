import React from "react";
import styles from "./index.scss";

interface MeetIframeProps {
  url: string;
}

export const MeetIframe: React.FC<MeetIframeProps> = ({ url }) => {
  return (
    <div className={styles.contentViewWrapper}>
      <span className={styles.spinner}></span>
      <iframe
        className={styles.viewer}
        title="Web Meeting"
        src={url}
        allow="camera;microphone"
      />
    </div>
  );
};
