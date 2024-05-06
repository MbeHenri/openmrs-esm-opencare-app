import { navigate, useSession, userHasAccess } from "@openmrs/esm-framework";
import { useEffect, useMemo } from "react";
import { actions } from "../privileges/doctor";
import React from "react";

const RestrictComponent = ({
  children,
  redirect = false,
}: React.PropsWithChildren<{ redirect?: boolean }>) => {
  // get a current User Id
  const user = useSession().user;
  const hasPrivileges = useMemo(() => userHasAccess(actions, user), []);

  const basename = window.getOpenmrsSpaBase() + "opencare";

  useEffect(() => {
    if (!hasPrivileges && redirect) {
      navigate({ to: `${basename}/unauthorized` });
    }
    return () => {};
  }, []);

  return <div>{hasPrivileges ? children : <></>}</div>;
};

export default RestrictComponent;
