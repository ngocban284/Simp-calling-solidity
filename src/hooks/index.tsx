import { useState, useEffect } from "react";

import {
  AbiItem,
  AbiTypeEnum,
  ParameterInput,
  Parameters,
} from "../interfaces";

import { encode, parse, callFunction } from "../utils";
import { pushGtagEvent } from "../utils/gtag";

declare const window: any;

const useAbiParser = () => {
  const [abi, setAbi] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [abiFunctions, setAbiFunctions] = useState<{ [x: string]: AbiItem }>(
    {}
  );

  const onChange = (value: string) => {
    if (parseError) {
      setParseError(null);
    }
    setAbi(value);
    if (!value) {
      setAbiFunctions({});
    }
  };

  const onParse = () => {
    try {
      if (parseError) {
        setParseError(null);
      }

      const parsedFunctions = parse(abi);

      setAbi(JSON.stringify(JSON.parse(abi), null, 2));

      setAbiFunctions(parsedFunctions);
    } catch (e: any) {
      pushGtagEvent("error", {
        event_category: "parser",
      });
      setParseError(e.message);
    }
  };

  return {
    abi,
    onChange,
    onParse,
    parseError,
    abiFunctions,
  };
};

const useParameters = () => {
  const initialState = {
    type: AbiTypeEnum.CONSTRUCTOR,
    contractAddress: "",
    funcName: "",
    inputs: [
      {
        type: "",
        value: "",
      },
    ] as ParameterInput[],
  };
  const [parameters, setParameters] = useState<Parameters>(initialState);
  const onChange = (parameters: Parameters) => {
    setParameters(parameters);
  };
  const onReset = () => {
    setParameters(initialState);
  };
  return {
    parameters,
    onChange,
    onReset,
  };
};

export const useAbiEncoder = () => {
  const [encoded, setEncoded] = useState<string>("");
  const [encodeErrors, setEncodeErrors] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const {
    abi,
    onChange: onAbiChange,
    parseError,
    onParse,
    abiFunctions,
  } = useAbiParser();

  const { parameters, onChange: onParametersChange, onReset } = useParameters();

  const onConnectWallet = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        setWalletAddress(accounts[0]);
      });
  };

  const onClear = () => {
    onAbiChange("");
    onReset();
  };

  const handleParseClick = () => {
    onParse();
    onReset();
  };

  const handleCallFuncClick = () => {
    callFunction(abi, parameters);
  };

  const onChange = (name: string) => (value: string | Parameters) => {
    if (name === "parameters") {
      onParametersChange(value as Parameters);
    } else if (name === "abi") {
      onAbiChange(value as string);
    }
  };

  useEffect(() => {
    const abiConstructor = abiFunctions[AbiTypeEnum.CONSTRUCTOR];
    if (typeof abiConstructor !== "undefined") {
      onParametersChange({
        type: AbiTypeEnum.CONSTRUCTOR,
        contractAddress: "",
        funcName: "",
        inputs: (abiConstructor.inputs || []).map((i) => ({ ...i, value: "" })),
      });
    }
  }, [abiFunctions]);

  useEffect(() => {
    const { errors, encoded } = encode(parameters);
    handleCallFuncClick();
    setEncoded(encoded);
    setEncodeErrors(errors);
  }, [
    parameters,
    parameters.type,
    parameters.contractAddress,
    parameters.funcName,
    parameters.inputs,
  ]);

  return {
    encoded,
    encodeErrors,
    abi,
    onChange,
    parseError,
    onParse: handleParseClick,
    onClear,
    onConnectWallet,
    abiFunctions,
    parameters,
    walletAddress,
  };
};
