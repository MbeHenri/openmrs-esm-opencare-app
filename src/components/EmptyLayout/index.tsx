import React from "react";
import { Layer, Tile } from "@carbon/react";
import { useLayoutType } from "@openmrs/esm-framework";
import styles from "./index.scss";

export interface EmptyLayoutProps {
  displayText: string;
  headerTitle: string;
}

export const EmptyLayout: React.FC<EmptyLayoutProps> = ({
  headerTitle,
  displayText,
}) => {
  const isTablet = useLayoutType() === "tablet";

  return (
    <Layer>
      <Tile className={styles.tile}>
        <div
          className={isTablet ? styles.tabletHeading : styles.desktopHeading}
        >
          <h4>{headerTitle}</h4>
        </div>
        <p className={styles.content}>
          There are no <span className={styles.displayText}>{displayText}</span>{" "}
          for this location
        </p>
      </Tile>
    </Layer>
  );
};
