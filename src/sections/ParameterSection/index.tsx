import React, { ChangeEvent, useMemo } from "react";
import Section from "../../components/Section";
import Input from "../../components/Input";
import FunctionSection from "./FunctionSection";
import {
  AbiInput,
  AbiItem,
  AbiTypeEnum,
  ParameterInput,
  Parameters,
} from "../../interfaces";
import FormGroup from "../../components/FormGroup";

import "./ParametersSection.css";

interface ParameterSectionProps {
  abiFunctions: { [x: string]: AbiItem };
  onChange: (parameters: Parameters) => void;
  onCallFunc: () => void;
  value: Parameters;
  errors?: string[];
}

const ParameterSection: React.FC<ParameterSectionProps> = ({
  abiFunctions,
  value,
  onChange,
  onCallFunc,
  errors,
}) => {
  const onChangeContractAddress = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, contractAddress: e.target.value });
  };

  return (
    <Section
      className="section-choose"
      title="Or enter your parameters manually"
    >
      <div className="row choose">
        <div className="col-md-3">
          <FormGroup label="Contract Address">
            <div className="contract-address">Address</div>
          </FormGroup>
        </div>
        <div className="col-md-7">
          <Input
            className="method-input__value"
            onChange={onChangeContractAddress}
            value={value.contractAddress}
            placeholder="Enter contract address."
            type="text"
            name="listen"
          />
        </div>
      </div>

      {Object.entries(abiFunctions).map(([keyFunction, abiFunction]) => (
        <FunctionSection
          abiFunction={abiFunction}
          keyFunction={keyFunction}
          onChange={onChange}
          onCallFunc={onCallFunc}
          value={value}
          errors={errors}
        />
      ))}
    </Section>
  );
};

export default ParameterSection;
