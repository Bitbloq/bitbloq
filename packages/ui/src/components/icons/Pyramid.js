import React from "react";

const SvgPyramid = props => (
  <svg width="1em" height="1em" viewBox="0 0 24 26" {...props}>
    <defs>
      <linearGradient
        id="pyramid_svg__a"
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
      <path fill="#4DC3FF" d="M12 3v21L0 19.023z" />
      <path
        fill="url(#pyramid_svg__a)"
        d="M24 16.034L12 21V0z"
        transform="translate(0 3)"
      />
    </g>
  </svg>
);

export default SvgPyramid;
