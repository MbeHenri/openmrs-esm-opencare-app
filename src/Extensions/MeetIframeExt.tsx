import React, { useMemo } from "react";
import { MeetIframe } from "../components/MeetIframe";

interface Props {
  url: string;
  context: string;
  closeWorkspace: () => void;
}

const MeetIframeExt: React.FC<Props> = ({ url }) => {
  return <MeetIframe url={url} />;
};

export default MeetIframeExt;
