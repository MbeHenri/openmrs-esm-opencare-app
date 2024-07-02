/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createLeftPanelLink } from "./left-panel-link.component";
import Root from "./root.component";
import { PaymentDashboardMeta, meetingDashboardMeta } from "./dashboard.meta";
import RoomButtonExt from "./Extensions/RoomButtonExt";
import DemandTabExt from "./Extensions/DemandTab";
import AppointmentTabExt from "./Extensions/AppointmentTabExt";

const moduleName = "@openmrs/esm-opencare-app";

const options = {
  featureName: "opencare",
  moduleName,
};

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/opencare`.
 */
/* export const root = getSyncLifecycle(
  Root,
  options
); */

export const root = getSyncLifecycle(Root, options);

export const meeting = getSyncLifecycle(
  createLeftPanelLink(meetingDashboardMeta),
  options
);

export const payment = getSyncLifecycle(
  createLeftPanelLink(PaymentDashboardMeta),
  options
);

/* export const roombutton = getSyncLifecycle(
  RoomButtonExt,
  options
); */

export const demandtab = getSyncLifecycle(
  DemandTabExt,
  options
);

export const appointmenttab = getSyncLifecycle(
  AppointmentTabExt,
  options
);