import React from "react";

const SvgUndo = props => (
  <svg
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 13 13"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M-1161-1522.03h3296v2238h-3296z" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M12.774 10.473c-.019.002-.037.002-.055.002a.278.278 0 0 1-.258-.162c-.032-.072-.836-1.801-3.84-2.144a21.817 21.817 0 0 0-2.286-.117v2.155c0 .1-.057.19-.149.238a.29.29 0 0 1-.286-.016L.127 6.702a.265.265 0 0 1-.124-.222.27.27 0 0 1 .124-.223L5.902 2.53a.284.284 0 0 1 .287-.014.265.265 0 0 1 .148.235v2.005c1.255.157 6.66 1.089 6.66 5.454a.272.272 0 0 1-.223.263z"
      />
    </g>
  </svg>
);

export default SvgUndo;
