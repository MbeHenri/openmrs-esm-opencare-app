import React from "react";
import { ValidateDemandForm } from "../components/Demand/form";

export interface ValidateDemandFormExtProps {
  demand: any;
  onClose?: () => void;
}

export const ValidateDemandFormExt: React.FC<ValidateDemandFormExtProps> = ({
  demand,
  onClose,
}) => {
  return <ValidateDemandForm demand={demand} onClose={onClose} />;
};
