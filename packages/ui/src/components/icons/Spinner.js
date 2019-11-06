import React from "react";

const SvgSpinner = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M0 100c0 55.229 44.771 100 100 100s100-44.771 100-100h-4c0 52.935-43.065 96-96 96S4 152.935 4 100 47.065 4 100 4V0C44.771 0 0 44.771 0 100"
    />
  </svg>
);

export default SvgSpinner;
