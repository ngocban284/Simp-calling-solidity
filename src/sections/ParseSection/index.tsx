import React, { useState } from "react";

import Section from "../../components/Section";
import CodeMirror from "../../components/CodeMirror";
import Button from "../../components/Button";

import "./ParseSection.css";
import { pushGtagParsesActionButton } from "../../utils/gtag";

interface ParseSectionProps {
  onChange: (value: string) => void;
  onClear: () => void;
  value: string;
  onParse: () => void;
  parseError: string | null;
}

const ParseSection: React.FC<ParseSectionProps> = ({
  onChange,
  onClear,
  value,
  onParse,
  parseError,
}) => {
  const [isAbi, setIsAbi] = useState(true);

  const handleArtifact = () => {
    setIsAbi(false);
  };

  const handleAbi = () => {
    setIsAbi(true);
  };

  const handleParseClick = () => {
    pushGtagParsesActionButton("parse");
    onParse();
  };
  const handleClearClick = () => {
    pushGtagParsesActionButton("clear");
    onClear();
  };
  return (
    <Section
      className="section-parse"
      title="Enter your contract's ABI to auto-parse"
    >
      <div className="parser-option">
        {isAbi == true ? (
          <>
            <button className="button button--active" onClick={handleAbi}>
              Abi
            </button>
            <button className="button button--hover" onClick={handleArtifact}>
              Artifact
            </button>
          </>
        ) : (
          <>
            <button className="button button--hover" onClick={handleAbi}>
              Abi
            </button>
            <button className="button button--active" onClick={handleArtifact}>
              Artifact
            </button>
          </>
        )}
      </div>
      {isAbi == true ? (
        <>
          <div className="input-field parse-input">
            <CodeMirror
              value={value}
              onChange={onChange}
              type="abi"
              placeholder={`Enter your ABI json  [{"inputs":[], "name": "myFunction", "type":"function"}]`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="input-field parse-input">
            <CodeMirror
              value={value}
              onChange={onChange}
              type="artifact"
              placeholder={`Enter your Artifact json  [{"inputs":[], "name": "myFunction", "type":"function"}]`}
            />
          </div>
        </>
      )}

      <div className="section-parse__buttons">
        {parseError && <label>Enter correct JSON</label>}
        <div>
          <Button hover onClick={handleClearClick}>
            Clear
          </Button>
          <Button hover onClick={handleParseClick}>
            Parse
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ParseSection;
