import React from "react";
import { useTranslation } from "react-i18next";

import { Layer, OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { useLayoutType } from "@openmrs/esm-framework";
import styles from "./menu.scss";

interface appointmentsActionMenuProps {
  appointment: any;
  patientUuid: string;
}

export const PatientAppointmentsActionMenu = ({
  appointment,
  patientUuid,
}: appointmentsActionMenuProps) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === "tablet";

  return (
    <Layer className={styles.layer}>
      <OverflowMenu
        aria-label="Edit or delete appointment"
        size={isTablet ? "lg" : "sm"}
        flipped
        align="left"
      >
        <OverflowMenuItem
          className={styles.menuItem}
          id="editAppointment"
          itemText={t("edit", "Edit")}
        />
        <OverflowMenuItem
          className={styles.menuItem}
          id="roomAppointment"
          itemText={t("room", "Go")}
        />
        <OverflowMenuItem
          className={styles.menuItem}
          id="cancelAppointment"
          itemText={t("cancel", "Cancel")}
          isDelete={true}
          hasDivider
        />
      </OverflowMenu>
    </Layer>
  );
};
