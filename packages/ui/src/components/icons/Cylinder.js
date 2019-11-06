import React from "react";
import uuid from "uuid/v1";

const SvgCylinder = props => {
  const gradientId = uuid();
  return (
    <svg viewBox="0 0 24 26" width="1em" height="1em" {...props}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#4DA6FF" />
          <stop offset="100%" stopColor="#4DE1FF" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill={`url(#${gradientId})`}
          d="M.005 5.809v13.117c0 3.206 4.549 5.805 10.16 5.805 5.612 0 10.16-2.599 10.16-5.805V5.81c0-3.206-4.548-5.805-10.16-5.805C4.554.004.005 2.603.005 5.81"
          transform="translate(1.818 .364)"
        />
        <path
          fill="#4DE1FF"
          d="M22.144 6.173c0 3.205-4.55 5.804-10.16 5.804-5.612 0-10.161-2.599-10.161-5.804 0-3.206 4.549-5.805 10.16-5.805 5.612 0 10.161 2.599 10.161 5.805"
        />
      </g>
    </svg>
  );
};

export default SvgCylinder;
