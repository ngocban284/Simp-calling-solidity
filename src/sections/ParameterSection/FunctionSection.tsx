import React, { ChangeEvent, useMemo, useState } from "react";

import Section from "../../components/Section";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
    AbiInput,
    AbiItem,
    AbiTypeEnum,
    ParameterInput,
    Parameters,
} from "../../interfaces";
import FormGroup from "../../components/FormGroup";

import "./ParametersSection.css";
import MethodInputs from "./MethodInputs";
import Select from "../../components/Select";
import {
    getStructType,
    isStructInput,
    hasFixedLengthArrayInput,
} from "../../utils";
import {
    pushGtagChooseFunction,
    pushGtagParsesActionButton,
} from "../../utils/gtag";

interface ParameterSectionProps {
    keyFunction: string;
    abiFunction: AbiItem;
    onChange: (parameters: Parameters) => void;
    onCallFunc: () => void;
    value: Parameters;
    errors?: string[];
}

const generateNumerableTypeOptions = (
    type: string,
    label: string,
    max: number,
    step: number
) => {
    const options = [];
    let i = 0;
    while (i <= max) {
        if (i === 0) {
            options.push({ value: type, label });
            options.push({ value: `${type}[]`, label: `${label}[]` });
        } else {
            options.push({ value: `${type}${i}`, label: `${label}${i}` });
            options.push({ value: `${type}${i}[]`, label: `${label}${i}[]` });
        }
        i += step;
    }
    return options;
};

const generateUintOptions = () => {
    return generateNumerableTypeOptions("uint", "Uint", 256, 8);
};

const generateBytesOptions = () => {
    return generateNumerableTypeOptions("bytes", "Bytes", 32, 1);
};

const getStructOptions = (fn?: AbiItem) => {
    const inputs = fn ? fn.inputs || [] : [];
    const tuples = inputs.filter((input: AbiInput) => isStructInput(input));
    return tuples.map((tuple: AbiInput) => {
        return {
            value: getStructType(tuple),
            label: tuple.internalType,
        };
    });
};

const getFixedLengthArrayOptions = (fn?: AbiItem) => {
    const inputs = fn ? fn.inputs || [] : [];
    const arrays = inputs.filter(
        (input: AbiInput) =>
            hasFixedLengthArrayInput(input) && !isStructInput(input)
    );

    return arrays.map((array: AbiInput) => {
        const type = array.internalType || "";
        const label = type[0].toUpperCase() + type.slice(1);

        return {
            value: array.internalType,
            label,
        };
    });
};

const getArgumentOptions = (fn: any) => {
    const structOptions = getStructOptions(fn);
    const fixedLengthArrayOptions = getFixedLengthArrayOptions(fn);

    return [
        { value: "address", label: "Address" },
        { value: "address[]", label: "Address[]" },
        { value: "string", label: "String" },
        { value: "bool", label: "Bool" },
        { value: "bool[]", label: "Bool[]" },
        ...generateUintOptions(),
        ...generateBytesOptions(),
        ...structOptions,
        ...fixedLengthArrayOptions,
    ];
};


const FunctionSection: React.FC<ParameterSectionProps> = ({
    keyFunction,
    abiFunction,
    value,
    onChange,
    onCallFunc,
    errors,
}) => {
    const onCallFuncClick = async () => {
        await onCallFunc();
    };

    let funcName = "";
    let stateMutability = "";

    const [inputs, setInputs] = useState<any[]>((abiFunction.inputs || []).map((input: any) => {
        return {
            ...input,
            value: ""
        };
    }))

    if (
        [AbiTypeEnum.CONSTRUCTOR, AbiTypeEnum.FUNCTION].indexOf(
            keyFunction as AbiTypeEnum
        ) === -1
    )
        funcName = abiFunction.name || "";
    stateMutability = abiFunction.stateMutability || "";

    value = ({
        ...value,
        type: keyFunction,
        funcName,
        stateMutability,
        inputs,
    });

    const onChangeInputs = (inputs: ParameterInput[]) => {
        setInputs(inputs);
    };

    const isConstructor = value.type === AbiTypeEnum.CONSTRUCTOR;
    const isCustomFunction = false;
    const functionOptions: {} = [];
    const argumentOptions = getArgumentOptions(value.type);

    return (
        <Section
            className="section-choose"
            title={abiFunction.name}
        >
            <MethodInputs
                value={value.inputs}
                onChange={onChangeInputs}
                options={argumentOptions}
                errors={errors}
                isCustomFunction={isCustomFunction}
            />
            <div className="section-choose__buttons">
                <Button className="button button--hover" onClick={() => {
                    onChange({
                        ...value,
                        funcName: keyFunction,
                        inputs
                    });
                }}>
                    Save parameters
                </Button>
                <Button className="button button--hover" onClick={onCallFuncClick}>
                    Call function
                </Button>
            </div>
        </Section>
    );
};

export default FunctionSection;