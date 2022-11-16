import React, { useState } from "react";

// import {Controlled as ControlledCodeMirror} from 'react-codemirror2'
import CodeMirrorOrignial, { ViewUpdate } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { artifactToAbi } from "../../utils";
import "./CodeMirror.css";

interface CodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CodeMirror: React.FC<CodeMirrorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const onBeforeChange = (value: string, _viewUpdate: ViewUpdate) => {
    onChange(value);
  };
  const onFocus = () => {
    setIsFocused(false);
  };
  const onBlur = () => {
    setIsFocused(false);
  };
  const showPlaceholder = !value && !isFocused && placeholder;

  return (
    <div className="CodeMirror-wrapper">
      {showPlaceholder && (
        <div className="CodeMirror-placeholder">{placeholder}</div>
      )}
      <CodeMirrorOrignial
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        theme="dark"
        extensions={[javascript()]}
        onChange={onBeforeChange}
      />
    </div>
  );
};

export default CodeMirror;
