import React from "react";

const SvgLoopImage = props => (
  <svg width="1em" height="1em" viewBox="0 0 152 92" {...props}>
    <defs>
      <filter
        id="loop-image_svg__c"
        width="104%"
        height="106.7%"
        x="-2%"
        y="-3.3%"
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
      <rect
        id="loop-image_svg__b"
        width={150}
        height={90}
        x={335}
        y={272}
        rx={10}
      />
      <path id="loop-image_svg__a" d="M168 261h328v112H168z" />
      <mask
        id="loop-image_svg__d"
        width={328}
        height={112}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#loop-image_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-334 -271)">
      <path stroke="#000" strokeWidth={2} d="M71 78h524v400H71z" />
      <g fillRule="nonzero">
        <use fill="#FFF" xlinkHref="#loop-image_svg__b" />
        <use
          fill="#000"
          filter="url(#loop-image_svg__c)"
          xlinkHref="#loop-image_svg__b"
        />
      </g>
      <use
        fillRule="nonzero"
        stroke="currentColor"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#loop-image_svg__d)"
        xlinkHref="#loop-image_svg__a"
      />
      <path
        fill="currentColor"
        d="M407.79 326.242l10.354 10.357a1.2 1.2 0 010 1.698l-10.361 10.351a1.205 1.205 0 01-1.702 0l-2.479-2.477a1.2 1.2 0 010-1.698l3.854-3.85h-13.794c-12.91 0-23.438-10.378-23.659-23.217-.226-13.219 10.839-24.038 24.08-24.038h1.876c.665 0 1.203.538 1.203 1.201v3.948c0 .663-.538 1.2-1.203 1.2h-2.297c-9.44 0-17.14 7.59-17.3 16.979-.165 9.666 7.963 17.577 17.645 17.577h13.45l-3.855-3.85a1.2 1.2 0 010-1.7l2.486-2.482a1.204 1.204 0 011.702 0zm18.548-32.864c12.91 0 23.438 10.377 23.659 23.216.226 13.22-10.839 24.039-24.08 24.039h-1.876a1.202 1.202 0 01-1.203-1.201v-3.948c0-.664.539-1.2 1.203-1.2h2.297c9.44 0 17.14-7.59 17.3-16.98.166-9.666-7.963-17.576-17.645-17.576h-13.45l3.855 3.85a1.2 1.2 0 010 1.698l-2.486 2.483c-.47.47-1.232.469-1.702 0l-10.353-10.357a1.2 1.2 0 010-1.698l10.36-10.352c.47-.47 1.232-.47 1.702 0l2.48 2.478a1.2 1.2 0 010 1.697l-3.855 3.851h13.794z"
      />
    </g>
  </svg>
);

export default SvgLoopImage;
