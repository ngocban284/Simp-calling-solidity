import React from "react";

import CopyButton from "../../components/CopyButton";
import Section from "../../components/Section";
import { pushGtagParsesActionButton } from "../../utils/gtag";
import "./EncodedSection.css";

const EncodedSection: React.FC<{ value: string }> = ({ value }) => {
  const onCopy = () => pushGtagParsesActionButton("copy");

  return (
    <Section className="encoded-section" title="Result of Transaction :">
      <textarea
        readOnly
        placeholder="Transaction hash"
        rows={30}
        cols={80}
        autoComplete="off"
        value={value}
      />
      <CopyButton hover textToCopy={value} disabled={!value} onCopy={onCopy} />
    </Section>
  );
};

export default EncodedSection;
