import React from "react";
import uuid from "uuid/v1";

const SvgCube = props => {
  const gradientId = uuid();
  return (
    <svg viewBox="0 0 24 26" width="1em" height="1em" {...props}>
      <defs>
        <linearGradient
          id={gradientId}
          x1="7.219%"
          x2="102.147%"
          y1="24.994%"
          y2="80.369%"
        >
          <stop offset="0%" stopColor="#4DA6FF" />
          <stop offset="100%" stopColor="#4DC3FF" />
        </linearGradient>
      </defs>
      <g fill="none">
        <path fill="#4DC3FF" d="M12 10.261v15.341L.068 20.49V5.148z" />
        <path
          fill={`url(#${gradientId})`}
          d="M23.932 5.148v15.34L12 25.603v-15.34z"
        />
        <path fill="#4DE1FF" d="M23.932 5.148L12 10.26.068 5.148 12 .034z" />
      </g>
    </svg>
  );
};

export default SvgCube;
