import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentSwitcher,
  DataTableSkeleton,
  Layer,
  Switch,
  Tile,
} from "@carbon/react";
import { useConfig, useLayoutType } from "@openmrs/esm-framework";
import PatientAppointmentsTable from "./tab";
import styles from "./index.scss";
import DoctorService, { AppointmentTypes } from "../../services/doctor";
import env from "../../repositories/env";

interface PatientAppointmentsBaseProps {
  patientUuid: string;
}

const PatientAppointmentsBase: React.FC<PatientAppointmentsBaseProps> = ({
  patientUuid,
}) => {
  //I. hooks
  const { t } = useTranslation();
  const isTablet = useLayoutType() === "tablet";
  const [contentSwitcherValue, setContentSwitcherValue] = useState(
    AppointmentTypes.UPCOMING
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [appointments, setAppointments] = useState<Map<number, Array<any>>>(
    new Map()
  );

  const [url, setUrl] = useState("");

  //recupération de la configuration
  const conf = useConfig();

  // update env variable

  env.API_HOST = conf["API_HOST"];
  env.API_PASSWORD = conf["API_PASSWORD"];
  env.API_PORT = conf["API_PORT"];
  env.API_USER = conf["API_USER"];
  const doctorService = DoctorService.getInstance();

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      setError(false);
      await doctorService
        .getAppointments(patientUuid)
        .then((appointments) => {
          if (appointments) {
            setAppointments(appointments);
          } else {
            setError(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fun();

    return () => {};
  }, []);

  const handleUrlMeeting = useCallback((url: string) => {
    setUrl(url);
  }, []);

  // II. returns
  if (loading) {
    return <DataTableSkeleton role="progressbar" compact={!isTablet} zebra />;
  }

  if (error) {
    return <span>Error</span>;
  }

  return (
    <>
      <div className={styles.contentSwitcherWrapper}>
        <ContentSwitcher
          size={isTablet ? "md" : "sm"}
          onChange={({ index }) => {
            setContentSwitcherValue(index);
          }}
        >
          <Switch name={"upcoming"} text={t("upcoming", "Upcoming")} />
          <Switch name={"today"} text={t("today", "Today")} />
          <Switch name={"past"} text={t("past", "Past")} />
        </ContentSwitcher>
      </div>

      {(() => {
        if (appointments.get(contentSwitcherValue).length > 0) {
          return (
            <PatientAppointmentsTable
              appointments={appointments.get(contentSwitcherValue)}
              handleUrlMeeting={handleUrlMeeting}
            />
          );
        }
        if (contentSwitcherValue === AppointmentTypes.UPCOMING) {
          return (
            <Layer>
              <Tile className={styles.tile}>
                <p className={styles.content}>
                  {t(
                    "noUpcomingAppointmentsForPatient",
                    "There are no upcoming appointments to display for this patient"
                  )}
                </p>
              </Tile>
            </Layer>
          );
        }
        if (contentSwitcherValue === AppointmentTypes.TODAY) {
          return (
            <Layer>
              <Tile className={styles.tile}>
                <p className={styles.content}>
                  {
                    "There are no appointments scheduled for today to display for this patient"
                  }
                </p>
              </Tile>
            </Layer>
          );
        }
        if (contentSwitcherValue === AppointmentTypes.PAST) {
          return (
            <Layer>
              <Tile className={styles.tile}>
                <p className={styles.content}>
                  {"There are no past appointments to display for this patient"}
                </p>
              </Tile>
            </Layer>
          );
        }

        if (url != "") {
          return (
            <iframe
              title="Web Meeting"
              src={url}
              style={{ width: "100%", height: "500px" }}
            />
          );
        }
      })()}

      {(() => {
        if (url != "") {
          return (
            <div className={styles.contentViewWrapper}>
              <iframe
                title="Web Meeting"
                src={url}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          );
        }
      })()}
    </>
  );
};

export default PatientAppointmentsBase;
