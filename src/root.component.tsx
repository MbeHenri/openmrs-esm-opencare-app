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
import { Home } from "./pages/home/home.component";
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
    env.API_HOST = conf["API_HOST"];
    env.API_PASSWORD = conf["API_PASSWORD"];
    env.API_PORT = conf["API_PORT"];
    env.API_USER = conf["API_USER"];
    env.API_SECURE = conf["API_SECURE"];
    return () => {};
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Route de la page d'acceuil */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
