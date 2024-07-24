import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  type DataTableHeader,
  Layer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
  Pagination,
} from "@carbon/react";

import {
  type ToastType,
  isDesktop,
  showModal,
  showToast,
  useConfig,
  useLayoutType,
  formatDatetime,
  parseDate,
  usePagination,
} from "@openmrs/esm-framework";
import { EmptyLayout } from "../EmptyLayout";
import styles from "./tab.scss";
import DoctorService from "../../services/doctor";
import env from "../../repositories/env";
import { Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { getPageSizes } from "../../utils";

const DemandTab: React.FC = (/* {} */) => {
  //I. hooks
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? "sm" : "lg";
  const [demands, setDemands] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  //recupération de la configuration
  const conf = useConfig();

  // update env variable

  env.API_HOST = conf["API_HOST"];
  env.API_PASSWORD = conf["API_PASSWORD"];
  env.API_PORT = conf["API_PORT"];
  env.API_USER = conf["API_USER"];
  env.API_SECURE = conf["API_SECURE"];
  const doctorService = useMemo(() => DoctorService.getInstance(), []);

  //const [reload, setReload] = useState("");
  // colonnes du tableau
  const headers: Array<typeof DataTableHeader> = useMemo(
    () => [
      { key: "numero", header: "N°" },
      { key: "patient", header: "Patient" },
      { key: "service", header: "Service" },
      { key: "date", header: "Date" },
      { key: "action", header: "Action" },
    ],
    []
  );

  // chargement des démandes
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [doctorService]);

  // filtrage et formatage des demandes
  const mapDemands = useMemo(() => {
    const map = new Map();
    demands.forEach((demand) => {
      map.set(demand.id, demand);
    });
    return map;
  }, [demands]);

  const tableRows = useMemo(
    () =>
      demands
        .map((demand, i) => {
          return {
            ...demand,
            date: formatDatetime(parseDate(demand.date), {
              mode: "wide",
            }),
            numero: i + 1,
          };
        })
        .filter((demand) => {
          if (searchString === "") {
            return true;
          }
          if (demand.date && `${demand.date}`.includes(searchString)) {
            return true;
          }
          if (demand.service && `${demand.service}`.includes(searchString)) {
            return true;
          }
          return false;
        }),
    [demands, searchString]
  );

  // pagination des demandes
  const { results, goTo, currentPage } = usePagination(tableRows, pageSize);

  // fonction de rejet
  const handleReject = useCallback(
    async (demand) => {
      if (!processing) {
        setProcessing(true);
        const res = await doctorService.rejectDemand(demand.id);
        let message = "";
        let type: ToastType = "error";
        if (res) {
          message = `the demand initiated by ${demand.patient} have been rejected`;
          await doctorService.getDemands().then((demands) => {
            if (demands) {
              setDemands(demands);
              type = "success";
            } else {
              setError(true);
            }
          });
        } else {
          message = `Erreur de rejet`;
        }
        setProcessing(false);
        showToast({ description: message, kind: type });
      }
    },
    [doctorService, processing]
  );

  // fonction de validation
  const handleValidate = useCallback(
    async (demand) => {
      if (!processing) {
        setProcessing(true);
        const dispose = showModal(
          "opencare-validate-demand-form",
          {
            demand,
            onClose: () => {
              dispose();
            },
          },
          async () => {
            await doctorService.getDemands().then((demands) => {
              if (demands) {
                setDemands(demands);
              } else {
                setError(true);
              }
            });
            setProcessing(false);
          }
        );
      }
    },
    [doctorService, processing]
  );

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
        <span className={styles.totalDemand}>
          Total :
          <span className={styles.totalDemandLength}>{demands.length}</span>
        </span>
      </Tile>
      <div className={styles.toolbar}>
        <Search
          className={styles.searchbar}
          labelText=""
          placeholder={t("filterTable", "Filter table")}
          onChange={(event) => setSearchString(event.target.value)}
          size={responsiveSize}
        />
      </div>
      <DataTable
        rows={results}
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
                  {rows.map((row) => (
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
                                  handleReject(mapDemands.get(row.id));
                                }}
                              >
                                Reject
                              </Button>
                              <Button
                                kind="primary"
                                size="small"
                                disable={processing}
                                onClick={() => {
                                  handleValidate(mapDemands.get(row.id));
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
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        pageSizes={getPageSizes(tableRows, 5) ?? []}
        onChange={({ page, pageSize }) => {
          goTo(page);
          setPageSize(pageSize);
        }}
        totalItems={tableRows.length}
      />
    </Layer>
  );
};

export default DemandTab;
