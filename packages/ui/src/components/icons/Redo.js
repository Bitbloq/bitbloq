import React from "react";

const SvgDo = props => (
  <svg
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 13 13"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M-1197-1522.03h3296v2238h-3296z" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M7.1 10.429a.29.29 0 0 1-.286.016.268.268 0 0 1-.148-.238V8.052c-.911.007-1.661.045-2.287.117-3.004.343-3.808 2.072-3.841 2.144a.276.276 0 0 1-.257.162c-.017 0-.037 0-.055-.003a.27.27 0 0 1-.223-.262c0-4.365 5.405-5.297 6.661-5.454V2.751c0-.097.055-.187.147-.235a.284.284 0 0 1 .287.014l5.775 3.727a.27.27 0 0 1 .124.223.265.265 0 0 1-.124.222L7.1 10.429z"
      />
    </g>
  </svg>
);

export default SvgDo;
