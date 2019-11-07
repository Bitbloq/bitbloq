import React from "react";

const SvgRectangle = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <filter
        id="rectangle_svg__c"
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
      <rect
        id="rectangle_svg__b"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <path id="rectangle_svg__a" d="M238 666h376v220H238z" />
      <mask
        id="rectangle_svg__d"
        width={376}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#rectangle_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-248 -676)">
      <path stroke="#000" strokeWidth={2} d="M76 537h653v403H76z" />
      <g fillRule="nonzero" transform="translate(248 676)">
        <use fill="#FFF" xlinkHref="#rectangle_svg__b" />
        <use
          fill="#000"
          filter="url(#rectangle_svg__c)"
          xlinkHref="#rectangle_svg__b"
        />
      </g>
      <path
        stroke="#000"
        strokeWidth={8}
        d="M268 815.795h159.927v-35.377H268z"
      />
      <path fill="#E7E7E7" d="M268 815.795h159.927v-68.177H268z" />
      <path fill="#F2F2F2" d="M268 785.588h159.927v-37.921H268z" />
      <path fill="#EB5157" d="M268.024 785.539H396.26v-37.921H268.024z" />
      <path
        fill="#F47E82"
        d="M351.22 742.176l45.041 1.333v37.921l-45.042-1.333h-38.154v-37.921h38.154zm-83.197 1.333l45.042-1.333v37.921l-45.042 1.333v-37.92z"
      />
      <path
        fill="#EB5157"
        d="M313.065 780.097h38.154v-5.603h-38.154zm0-43.757v5.603l5.587 19.077v-5.603zm38.155 0l-5.588 19.077v5.603l5.587-19.077z"
      />
      <path
        fill="#F47E82"
        d="M313.065 736.34l5.588 19.077-5.588 19.077h38.154l-5.587-19.077 5.587-19.077z"
      />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#rectangle_svg__d)"
        xlinkHref="#rectangle_svg__a"
      />
    </g>
  </svg>
);

export default SvgRectangle;
