import { navigate, useSession, userHasAccess } from "@openmrs/esm-framework";
import React, { useEffect, useMemo } from "react";
import { actions } from "../../privileges/doctor";

export function Unauthorized() {
  const user = useSession().user;
  const hasPrivileges = useMemo(() => userHasAccess(actions, user), []);
  const basename = window.getOpenmrsSpaBase() + "opencare";

  useEffect(() => {
    if (hasPrivileges) {
      navigate({ to: `${basename}/home` });
    }
    return () => {};
  }, []);

  return <h3> Vous n'etes pas autorizé à accéder à cette page </h3>;
}
