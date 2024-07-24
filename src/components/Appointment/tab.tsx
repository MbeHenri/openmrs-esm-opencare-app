import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  type DataTableHeader,
  Table,
  Layer,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
} from "@carbon/react";
import {
  formatDatetime,
  isDesktop,
  parseDate,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import { Button } from "@carbon/react";
import { getPageSizes } from "../../utils";

interface AppointmentTableProps {
  appointments: Array<any>;
  handleUrlMeeting: (url: string) => void;
}

const PatientAppointmentsTable: React.FC<AppointmentTableProps> = ({
  appointments,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleUrlMeeting = (url) => {},
}) => {
  // I. hooks

  const { t } = useTranslation();
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? "sm" : "lg";
  const [pageSize, setPageSize] = useState(5);

  const tableRows = useMemo(
    () =>
      appointments.map((appointment) => {
        return {
          id: appointment.uuid,
          date: formatDatetime(parseDate(appointment.startDateTime), {
            mode: "wide",
          }),
          location: appointment?.location ? appointment?.location : "——",
          service: appointment.service,
          status: appointment.status,
          type: appointment.appointmentKind
            ? appointment.appointmentKind
            : "——",
          notes: appointment.comments ? appointment.comments : "——",
        };
      }),
    [appointments]
  );

  const mapAppointments = useMemo(() => {
    const map = new Map();
    appointments.forEach((appointment) => {
      map.set(appointment.uuid, appointment);
    });
    return map;
  }, [appointments]);

  const { results, goTo, currentPage } = usePagination(tableRows, pageSize);

  const tableHeaders: Array<typeof DataTableHeader> = useMemo(
    () => [
      { key: "date", header: t("date", "Date") },
      { key: "location", header: t("location", "Location") },
      { key: "service", header: t("service", "Service") },
      { key: "status", header: t("status", "Status") },
      { key: "type", header: t("type", "Type") },
      { key: "notes", header: t("notes", "Notes") },
    ],
    [t]
  );

  const HandleJoin = useCallback(
    (appointment) => {
      handleUrlMeeting(appointment.linkRoom);
    },
    [handleUrlMeeting]
  );

  return (
    <Layer style={{ marginBottom: "1rem" }}>
      <DataTable
        rows={results}
        headers={tableHeaders}
        isSortable
        size={responsiveSize}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({
                        header,
                        isSortable: header.isSortable,
                      })}
                    >
                      {header.header?.content ?? header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.value?.content ?? cell.value}
                      </TableCell>
                    ))}
                    <TableCell className="cds--table-column-menu">
                      {/* <PatientAppointmentsActionMenu
                        appointment={appointments[i]}
                        patientUuid={patientUuid}
                      /> */}
                      <Button
                        size="small"
                        onClick={() => {
                          HandleJoin(mapAppointments.get(row.id));
                        }}
                      >
                        Joindre
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        pageSizes={getPageSizes(results, 5) ?? []}
        onChange={({ page, pageSize }) => {
          goTo(page);
          setPageSize(pageSize);
        }}
        totalItems={results.length}
      />
    </Layer>
  );
};

export default PatientAppointmentsTable;
