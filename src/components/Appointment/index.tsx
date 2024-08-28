import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentSwitcher,
  DataTableSkeleton,
  Layer,
  Switch,
  Tile,
} from "@carbon/react";
import {
  getCurrentUser,
  useConfig,
  useLayoutType,
  useSession,
  //launchWorkspaces
} from "@openmrs/esm-framework";
import PatientAppointmentsTable from "./tab";
import styles from "./index.scss";
import DoctorService, { AppointmentTypes } from "../../services/doctor";
import env from "../../repositories/env";
import { MeetIframe } from "../MeetIframe";

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

  const [tokenNextcloud, setTokenNextcloud] = useState("");

  const { user } = useSession();

  const [url, setUrl] = useState("");

  //recupération de la configuration
  const conf = useConfig();

  // update env variable

  env.API_HOST = conf["API_HOST"];
  env.API_PASSWORD = conf["API_PASSWORD"];
  env.API_PORT = conf["API_PORT"];
  env.API_USER = conf["API_USER"];
  env.API_SECURE = conf["API_SECURE"];
  const doctorService = useMemo(() => DoctorService.getInstance(), []);

  // chargement des appointements
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [doctorService, patientUuid]);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      setError(false);
      await doctorService
        .getTokenNextcloud(patientUuid)
        .then((token) => {
          setTokenNextcloud(token);
        })
        .catch((e) => console.error(e));
    };
    fun();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [doctorService, patientUuid]);

  const handleUrlMeeting = useCallback((url: string) => {
    setUrl(url);
    /* launchWorkspace("opencare-meet-iframe", {
      url,
      context: "view",
    }); */
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
            <MeetIframe
              url={url}
              username={user.display}
              token={tokenNextcloud}
            />
          );
        }
      })()}
    </>
  );
};

export default PatientAppointmentsBase;
