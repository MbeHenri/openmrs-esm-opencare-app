import React, { useMemo } from "react";
import classNames from "classnames";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ConfigurableLink } from "@openmrs/esm-framework";

export interface LinkConfig {
  name: string;
  title: string;
}

function LinkExtension({ config }: { config: LinkConfig }) {
  const { name, title } = config;
  const location = useLocation();
  //const spaBasePath = window.getOpenmrsSpaBase() + "home/opencare";
  const spaBasePath = window.getOpenmrsSpaBase() + "opencare";

  const urlSegment = useMemo(() => {
    const pathArray = location.pathname.split("/");
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  return (
    <ConfigurableLink
      to={spaBasePath + "/" + name}
      className={classNames("cds--side-nav__link", {
        "active-left-nav-link": urlSegment.match(name),
      })}
    >
      {title}
    </ConfigurableLink>
  );
}

export const createLeftPanelLink = (config: LinkConfig) => () =>
  (
    <BrowserRouter>
      <LinkExtension config={config} />
    </BrowserRouter>
  );
