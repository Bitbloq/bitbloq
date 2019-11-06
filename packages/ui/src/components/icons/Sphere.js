import React from "react";
import uuid from "uuid/v1";

const SvgSphere = props => {
  const gradientId = uuid();
  return (
    <svg viewBox="0 0 24 26" width="1em" height="1em" {...props}>
      <defs>
        <radialGradient
          id={gradientId}
          cx="74.385%"
          cy="25.339%"
          r="81.924%"
          fx="74.385%"
          fy="25.339%"
          gradientTransform="matrix(.50558 .86225 -.86278 .50528 .586 -.516)"
        >
          <stop offset="0%" stopColor="#4DE1FF" />
          <stop offset="100%" stopColor="#4DA6FF" />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M23.97 13.588C24.474 6.32 18.526.315 11.272.749 4.982 1.123 0 6.345 0 12.73c0 6.635 5.378 12.013 12.012 12.013 6.347 0 11.543-4.922 11.982-11.156"
      />
    </svg>
  );
};

export default SvgSphere;
