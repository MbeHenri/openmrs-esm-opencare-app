import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Layer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";

import {
  formatDatetime,
  isDesktop,
  parseDate,
  useConfig,
  useLayoutType,
} from "@openmrs/esm-framework";
import { EmptyLayout } from "../EmptyLayout";
import styles from "./tab.scss";
import DoctorService from "../../services/doctor";
import env from "../../repositories/env";

const headers = [
  { key: "patient", header: "Patient" },
  { key: "service", header: "Service" },
  { key: "date", header: "Date" },
  { key: "action", header: "Action" },
];

const DemandTab: React.FC = ({}) => {
  //I. hooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? "sm" : "lg";
  const [demands, setDemands] = useState([]);

  //recupération de la configuration
  const conf = useConfig();

  // update env variable

  env.API_HOST = conf["API_HOST"];
  env.API_PASSWORD = conf["API_PASSWORD"];
  env.API_PORT = conf["API_PORT"];
  env.API_USER = conf["API_USER"];
  const doctorService = DoctorService.getInstance();

  const [reload, setReload] = useState("");

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      setError(false);
      await doctorService
        .getDemands()
        .then((demands) => {
          if (demands) {
            setDemands(demands);
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

  const [processing, setProcessing] = useState(false);
  const handleReject = useCallback(async (demand) => {
    if (!processing) {
      setProcessing(true);
      const res = await doctorService.rejectDemand(demand.id);
      let message = "";
      if (res) {
        message = `the demand initiated by ${demand.patient} have been rejected`;
        await doctorService.getDemands().then((demands) => {
          if (demands) {
            setDemands(demands);
          } else {
            setError(true);
          }
        });
      } else {
        message = `Erreur de rejet`;
      }
      setProcessing(false);
      alert(message);
    }
  }, []);

  const handleValidate = useCallback(async (demand) => {
    if (!processing) {
      setProcessing(true);

      const doctor_id = "qsdqsdqsdqsdqsd";
      const duration = 30;
      const startDate = new Date();
      const res = await doctorService.validateDemand(
        demand.id,
        doctor_id,
        startDate,
        duration
      );
      let message = "";
      if (res) {
        message = `the demand initiated by ${demand.patient} have been validated`;
        await doctorService.getDemands().then((demands) => {
          if (demands) {
            setDemands(demands);
          } else {
            setError(true);
          }
        });
      } else {
        message = `Erreur de rejet`;
      }
      setProcessing(false);
      alert(message);
    }
  }, []);

  // II. returns
  if (loading) {
    return <DataTableSkeleton role="progressbar" row={5} />;
  }

  if (error) {
    return <span>Error</span>;
  }

  if (demands.length == 0) {
    return <EmptyLayout headerTitle={"Demands"} displayText={"demands"} />;
  }

  return (
    <Layer className={styles.container}>
      <Tile className={styles.headerContainer}>
        <div
          className={
            isDesktop(layout) ? styles.desktopHeading : styles.tabletHeading
          }
        >
          <h4>Demands</h4>
        </div>
      </Tile>
      <DataTable
        rows={demands}
        headers={headers}
        isSortable
        size={responsiveSize}
        useZebraStyles
      >
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getTableContainerProps,
        }) => (
          <>
            <TableContainer {...getTableContainerProps()}>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.value ? (
                            cell.value
                          ) : (
                            <TableCell>
                              <Button
                                kind="danger"
                                size="small"
                                disable={processing}
                                onClick={() => {
                                  handleReject(demands[i]);
                                }}
                              >
                                Rejet
                              </Button>
                              <Button
                                kind="primary"
                                size="small"
                                onClick={() => {
                                  handleValidate(demands[i]);
                                }}
                              >
                                Validation
                              </Button>
                            </TableCell>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DataTable>
    </Layer>
  );
};

export default DemandTab;
