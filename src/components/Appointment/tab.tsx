import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  type DataTableHeader,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import {
  formatDatetime,
  parseDate,
  useLayoutType,
} from "@openmrs/esm-framework";
import { Button } from "@carbon/react";

interface AppointmentTableProps {
  appointments: Array<any>;
  handleUrlMeeting: (url: string) => void;
}

const PatientAppointmentsTable: React.FC<AppointmentTableProps> = ({
  appointments,
  handleUrlMeeting = (url) => {},
}) => {
  const { t } = useTranslation();

  const isTablet = useLayoutType() === "tablet";

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
  const basename = useMemo(() => window.getOpenmrsSpaBase() + "opencare", []);

  const HandleJoin = useCallback((appointment) => {
    handleUrlMeeting(appointment.linkRoom);
  }, []);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <DataTable
        rows={tableRows}
        headers={tableHeaders}
        isSortable
        size={isTablet ? "lg" : "sm"}
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
                          HandleJoin(appointments[i]);
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
    </div>
  );
};

export default PatientAppointmentsTable;
