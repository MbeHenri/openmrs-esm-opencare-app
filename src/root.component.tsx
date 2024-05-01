/**
 * From here, the application is pretty typical React, but with lots of
 * support from `@openmrs/esm-framework`. Check out `Greeter` to see
 * usage of the configuration system, and check out `PatientGetter` to
 * see data fetching using the OpenMRS FHIR API.
 *
 * Check out the Config docs:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Payment } from "./pages/payment/payment.component";
import { Meeting } from "./pages/metting/meeting.component";
import { DetailMeeting } from "./pages/metting/details.component";
// import { useTranslation } from "react-i18next";
//import styles from "./root.scss";

const Root: React.FC = () => {
  // const { t } = useTranslation();
  //const basename = window.getOpenmrsSpaBase() + "home/opencare";
  const basename = window.getOpenmrsSpaBase() + "opencare";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/meeting/:patientId" element={<DetailMeeting />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
