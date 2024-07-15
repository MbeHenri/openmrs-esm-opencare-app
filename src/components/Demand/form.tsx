import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Dropdown,
  DatePicker,
  DatePickerInput,
  NumberInput,
  TimePicker,
  TimePickerSelect,
  SelectItem,
  Button,
} from "@carbon/react";
import { Layer, Tile } from "@carbon/react";
import { showToast, useConfig /*useLayoutType*/ } from "@openmrs/esm-framework";
import styles from "./form.scss";
import env from "../../repositories/env";
import DoctorService from "../../services/doctor";
//import { inLocalTimeOffsetUTC } from "../../utils";

export interface ValidateDemandFormProps {
  demand: any;
  onClose: () => void;
}

interface Doctor {
  id: string;
  name: string;
}

export const ValidateDemandForm: React.FC<ValidateDemandFormProps> = ({
  demand,
  onClose,
}) => {
  //const isTablet = useLayoutType() === "tablet";

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00");
  const [ampm, setAmpm] = useState<string>("AM");
  const [duration, setDuration] = useState<number>(0);
  const [doctors, setDoctors] = useState([]);
  //recupération de la configuration

  const [processing, setProcessing] = useState(false);
  const conf = useConfig();

  // update env variable

  env.API_HOST = conf["API_HOST"];
  env.API_PASSWORD = conf["API_PASSWORD"];
  env.API_PORT = conf["API_PORT"];
  env.API_USER = conf["API_USER"];
  env.API_SECURE = conf["API_SECURE"];
  const doctorService = DoctorService.getInstance();

  useEffect(() => {
    const fun = async () => {
      await doctorService.getProviders().then((doctors) => {
        if (doctors) {
          setDoctors(doctors);
        }
      });
    };
    fun();

    return () => {};
  }, []);

  const handleDoctorChange = useCallback(
    (selectedItem: any) => {
      const doctor = doctors.find(
        (doc) => doc.name === selectedItem.selectedItem
      );
      setSelectedDoctor(doctor || null);
    },
    [doctors]
  );

  const handleStartDateChange = (date: Date[]) => {
    setStartDate(date[0] || null);
  };

  const handleStartTimeChange = (event: any) => {
    setStartTime(event.target.value);
  };

  const handleAmpmChange = (event: any) => {
    setAmpm(event.target.value);
  };

  const handleDurationChange = (event: any) => {
    setDuration(event.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (startDate && startTime) {
      if (!processing) {
        setProcessing(true);
        let [hours, minutes] = startTime.split(":").map(Number);
        if (ampm === "PM" && hours < 12) {
          hours += 12;
        }
        if (ampm === "AM" && hours === 12) {
          hours = 0;
        }
        const combinedDateTime = new Date(startDate);
        combinedDateTime.setHours(hours, minutes);

        // Gestion de la soumission du formulaire
        const res = await doctorService.validateDemand(
          demand.id,
          selectedDoctor.id,
          combinedDateTime,
          duration
        );
        /* const res = true; */
        if (res) {
          showToast({
            description: `the demand initiated by ${demand.patient} have been validated`,
            kind: "success",
          });
        } else {
          showToast({ description: `error during validation`, kind: "error" });
        }
        setProcessing(false);
        if (onClose) {
          onClose();
        }
      }
    }
  }, [processing]);

  const handleCancel = useCallback(() => {
    // Gestion de l'annulation du formulaire
    /* showToast({ description: `cancel` }); */
    if (!processing) {
      if (onClose) {
        onClose();
      }
    }
  }, [processing]);

  return (
    <Layer>
      <Tile>
        <h2>Validate demand</h2>
      </Tile>
      <Form>
        <div className={styles.formGroupsContainer}>
          <FormGroup
            legendText="Provider"
            className={styles.formGroupContainer}
          >
            <Dropdown
              id="doctor-dropdown"
              items={doctors.map((doc) => doc.name)}
              onChange={handleDoctorChange}
            />
          </FormGroup>

          <FormGroup
            legendText="StartDateTime"
            className={styles.formGroupContainer}
            style={{ display: "flex" }}
          >
            <DatePicker
              dateFormat="d/m/Y"
              datePickerType="single"
              onChange={handleStartDateChange}
            >
              <DatePickerInput
                id="start-date-picker"
                placeholder="jj/mm/aaaa"
              />
            </DatePicker>
            <TimePicker
              id="start-time-picker"
              onChange={handleStartTimeChange}
              value={startTime}
            />
            <TimePickerSelect
              id="time-picker-select-ampm"
              labelText="AM/PM"
              onChange={handleAmpmChange}
            >
              <SelectItem value="AM" text="AM" />
              <SelectItem value="PM" text="PM" />
            </TimePickerSelect>
          </FormGroup>

          <FormGroup
            legendText="Duration (minutes)"
            className={styles.formGroupContainer}
          >
            <NumberInput
              id="duration-input"
              min={0}
              value={duration}
              onChange={handleDurationChange}
            />
          </FormGroup>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            kind="secondary"
            size="large"
            className={styles.formButton}
            onClick={handleCancel}
            disable={processing}
          >
            Cancel
          </Button>
          <Button
            kind="primary"
            size="large"
            className={styles.formButton}
            disable={processing}
            onClick={handleSubmit}
          >
            {processing ? "Validate ..." : "Validate"}
          </Button>
        </div>
      </Form>
    </Layer>
  );
};
