import React from "react";

const SvgEllipsis = props => (
  <svg width="1em" height="1em" viewBox="0 0 13 13" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-10-3a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 1.5 5zm5 3a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 6.5 8z"
    />
  </svg>
);

export default SvgEllipsis;
