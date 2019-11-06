import React from "react";

const SvgBulb = ({ isOn, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <path id="bulb_svg__d" d="M0 .533h114.424v138.512H0z" />
      <path id="bulb_svg__a" d="M715 4180h376v220H715z" />
      <filter
        id="bulb_svg__c"
        width="103%"
        height="103%"
        x="-1.5%"
        y="-1.5%"
        filterUnits="objectBoundingBox"
      >
        <feGaussianBlur
          in="SourceAlpha"
          result="shadowBlurInner1"
          stdDeviation={3}
        />
        <feOffset in="shadowBlurInner1" result="shadowOffsetInner1" />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          k2={-1}
          k3={1}
          operator="arithmetic"
          result="shadowInnerInner1"
        />
        <feColorMatrix
          in="shadowInnerInner1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
        />
      </filter>
      <rect id="bulb_svg__b" width={198} height={198} x={1} y={1} rx={10} />
      <mask id="bulb_svg__f" width={376} height={220} x={0} y={0} fill="#fff">
        <use xlinkHref="#bulb_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-725 -4190)">
      <path stroke="#000" strokeWidth={2} d="M645 4072h495v361H645z" />
      <g fillRule="nonzero" transform="translate(725 4190)">
        <use fill="#FFF" xlinkHref="#bulb_svg__b" />
        <use fill="#000" filter="url(#bulb_svg__c)" xlinkHref="#bulb_svg__b" />
      </g>
      <path
        fill="#CDCDCD"
        d="M825.214 4319.838c-15.8 0-28.607 4.703-28.607 10.503v29.664c0 3.503 4.69 6.6 11.877 8.51.467 5.54 7.743 9.953 16.73 9.953 8.983 0 16.26-4.413 16.727-9.953 7.186-1.91 11.88-5.007 11.88-8.51v-29.664c0-5.8-12.81-10.503-28.607-10.503"
      />
      <path
        fill="#B4B4B4"
        d="M853.818 4341.391v6.487c0 5.803-12.807 10.503-28.604 10.503-15.8 0-28.606-4.7-28.606-10.503v-6.487c-2.09 1.833-3.334 3.99-3.334 6.487 0 9.083 16.067 13.836 31.94 13.836 15.87 0 31.937-4.753 31.937-13.836 0-2.497-1.243-4.654-3.333-6.487"
      />
      <path
        fill="#B4B4B4"
        d="M853.818 4329.636v6.487c0 5.803-12.807 10.507-28.604 10.507-15.8 0-28.606-4.704-28.606-10.507v-6.487c-2.09 1.834-3.334 3.99-3.334 6.487 0 9.083 16.067 13.84 31.94 13.84 15.87 0 31.937-4.757 31.937-13.84 0-2.497-1.243-4.653-3.333-6.487"
      />
      <path
        fill="#9A9A9A"
        d="M853.818 4330.343c0 5.803-12.807 10.503-28.604 10.503-15.8 0-28.606-4.7-28.606-10.503 0-5.804 12.806-10.504 28.606-10.504 15.797 0 28.604 4.7 28.604 10.504"
      />
      <g transform="translate(768 4201.801)">
        <mask id="bulb_svg__e" fill="#fff">
          <use xlinkHref="#bulb_svg__d" />
        </mask>
        <path
          fill={isOn ? "rgba(248, 231, 28, 0.8)" : "#F2F2F2"}
          fillOpacity={isOn ? 0.9 : 0.5}
          d="M50.674.895C24.471 3.802 3.288 24.975.368 51.178c-2.224 19.92 5.81 38.027 19.47 49.814 5.936 5.123 8.92 12.816 8.773 20.656-.033 1.704.11 3.45.393 5.217.027.167.037.333.067.5.293 1.657.747 3.26 1.327 4.807 4.026 4.01 14.496 6.873 26.816 6.873 12.25 0 22.674-2.833 26.747-6.81a28.202 28.202 0 001.443-5.413c.247-1.514.414-3.057.414-4.64v-.144c-.04-8.046 2.85-15.903 8.926-21.18 12.05-10.473 19.68-25.89 19.68-43.113 0-33.753-29.226-60.677-63.75-56.85"
          mask="url(#bulb_svg__e)"
        />
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#bulb_svg__f)"
        xlinkHref="#bulb_svg__a"
      />
    </g>
  </svg>
);

export default SvgBulb;
