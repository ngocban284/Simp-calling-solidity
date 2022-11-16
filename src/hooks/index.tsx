import { useState, useEffect } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import {
  AbiItem,
  AbiTypeEnum,
  ParameterInput,
  Parameters,
} from "../interfaces";

import { encode, isArrayType, parse } from "../utils";
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
      if (JSON.parse(abi)["abi"]) {
        const parsedFunctions = parse(
          JSON.stringify(JSON.parse(abi)["abi"], null, 2)
        );
        setAbi(JSON.stringify(JSON.parse(abi)["abi"], null, 2));
        setAbiFunctions(parsedFunctions);
      } else {
        const parsedFunctions = parse(abi);

        setAbi(JSON.stringify(JSON.parse(abi), null, 2));

        setAbiFunctions(parsedFunctions);
      }
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
    stateMutability: "",
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
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [result, setResult] = useState<string>("");

  const {
    abi,
    onChange: onAbiChange,
    parseError,
    onParse,
    abiFunctions,
  } = useAbiParser();

  const { parameters, onChange: onParametersChange, onReset } = useParameters();

  const onClear = () => {
    onAbiChange("");
    onReset();
  };

  const handleParseClick = () => {
    onParse();
    onReset();
  };

  const handlerCallFuncResult = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    // // get contract
    const contract = new ethers.Contract(
      parameters.contractAddress,
      abi,
      signer
    );

    // get name of function from parameters
    const functionName = parameters.funcName;
    // type of type of function
    const stateMutability = parameters.stateMutability;
    // get arguments of function from parameters
    const inputs = parameters.inputs;
    // define array
    const args: any[] = [];

    // definet any variable
    let result: any;

    if (stateMutability === "view" || stateMutability === "pure") {
      for (let i = 0; i < inputs.length; i++) {
        args.push(inputs[i].value);
      }
      result = await contract[functionName](...args);
    } else {
      for (let i = 0; i < inputs.length; i++) {
        args.push(inputs[i].value);
      }
      // user address call with . setting gas manually
      let tx = await contract[functionName](...args, { gasLimit: 3e6 });

      result = await tx.wait();
      result = JSON.stringify(result, null, 2);
    }

    setResult(result);
  };

  const handleCallFuncClick = async () => {
    await handlerCallFuncResult();
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
        stateMutability: "",
        inputs: (abiConstructor.inputs || []).map((i) => ({ ...i, value: "" })),
      });
    }
  }, [abiFunctions]);

  useEffect(() => {
    // const { errors, encoded } = encode(parameters);
    setEncoded(result);
    // setEncodeErrors(errors);
  }, [
    parameters,
    parameters.type,
    parameters.contractAddress,
    parameters.funcName,
    parameters.inputs,
    result,
  ]);

  return {
    encoded,
    encodeErrors,
    abi,
    onChange,
    parseError,
    onParse: handleParseClick,
    onClear,
    handleCallFuncClick,
    abiFunctions,
    parameters,
  };
};
