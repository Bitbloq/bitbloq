import React from "react";
import uuid from "uuid/v1";

const SvgPrism = props => {
  const gradientId = uuid();
  return (
    <svg viewBox="0 0 24 26" width="1em" height="1em" {...props}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="56.091%" y2="85.849%">
          <stop offset="0%" stopColor="#4DA6FF" />
          <stop offset="100%" stopColor="#4DC3FF" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill={`url(#${gradientId})`}
          d="M20.284 3.39L10.142 0v24.718l10.142-3.39V10.17z"
          transform="translate(1.818 .364)"
        />
        <path fill="#4DC3FF" d="M11.96.364L1.818 3.754v17.938l10.142 3.39z" />
        <path
          fill="#4DE1FF"
          d="M22.102 10.533v-6.78L11.96.363 1.818 3.754v6.78l10.142 3.39z"
        />
      </g>
    </svg>
  );
};

export default SvgPrism;
