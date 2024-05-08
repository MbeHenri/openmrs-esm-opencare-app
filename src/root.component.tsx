/**
 * From here, the application is pretty typical React, but with lots of
 * support from `@openmrs/esm-framework`. Check out `Greeter` to see
 * usage of the configuration system, and check out `PatientGetter` to
 * see data fetching using the OpenMRS FHIR API.
 *
 * Check out the Config docs:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 */

import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Payment } from "./pages/payment/payment.component";
import { Meeting } from "./pages/metting/meeting.component";
import { DetailMeeting } from "./pages/metting/details.component";
import RestrictComponent from "./components/RestrictComponent";
import { Home } from "./pages/home/home.component";
import { Unauthorized } from "./pages/unauthorized";
import { useConfig } from "@openmrs/esm-framework";
import env from "./repositories/env";
// import { useTranslation } from "react-i18next";
//import styles from "./root.scss";

const Root: React.FC = () => {
  // const { t } = useTranslation();
  //const basename = window.getOpenmrsSpaBase() + "home/opencare";
  const basename = window.getOpenmrsSpaBase() + "opencare";

  //recupération de la configuration
  const conf = useConfig();

  // update env variable
  useEffect(() => {
    env.TALK_HOST = conf["TALK_HOST"];
    env.TALK_PASSWORD = conf["TALK_PASSWORD"];
    env.TALK_PORT = conf["TALK_PORT"];
    env.TALK_USER = conf["TALK_USER"];
    return () => {};
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Route de la page d'acceuil */}
        <Route
          path="/home"
          element={
            <RestrictComponent redirect>
              <Home />
            </RestrictComponent>
          }
        />

        {/* Route des meetings */}
        <Route
          path="/meeting"
          element={
            <RestrictComponent redirect>
              <Meeting />
            </RestrictComponent>
          }
        />

        {/* Route d'une conversation précise */}
        <Route
          path="/meeting/:token"
          element={
            <RestrictComponent redirect>
              <DetailMeeting />
            </RestrictComponent>
          }
        />

        {/* Route de l'espace facturation */}
        <Route
          path="/payment"
          element={
            <RestrictComponent redirect>
              <Payment />
            </RestrictComponent>
          }
        />
        {/* Route de la vue non authorizé */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
