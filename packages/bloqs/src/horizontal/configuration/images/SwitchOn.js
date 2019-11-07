import React from "react";

const SvgRectangle = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <radialGradient
        id="rectangle_svg__d"
        cx="50.751%"
        cy="98.714%"
        r="98.682%"
        fx="50.751%"
        fy="98.714%"
        gradientTransform="matrix(0 -1 .8035 0 -.286 1.495)"
      >
        <stop offset="0%" stopColor="#ADADAD" />
        <stop offset="100%" stopColor="#E7E7E7" />
      </radialGradient>
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
      <path id="rectangle_svg__a" d="M962 666h376v220H962z" />
      <mask
        id="rectangle_svg__e"
        width={376}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#rectangle_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-972 -676)">
      <path stroke="#000" strokeWidth={2} d="M797 537h653v403H797z" />
      <g fillRule="nonzero" transform="translate(972 676)">
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
        d="M992 815.795h159.927v-35.377H992z"
      />
      <path fill="#E7E7E7" d="M992 815.795h159.927v-68.177H992z" />
      <path fill="#F2F2F2" d="M992 785.539h159.927v-37.921H992z" />
      <path fill="#EB5157" d="M1023.69 785.539h128.238v-37.921H1023.69z" />
      <path
        fill="#F47E82"
        d="M1106.886 742.176l45.042 1.333v37.921l-45.042-1.333h-38.154v-37.921h38.154zm-83.196 1.333l45.042-1.333v37.921l-45.042 1.333v-37.92z"
      />
      <path
        fill="#EB5157"
        d="M1068.732 780.097h38.154v-5.603h-38.154zm0-43.757v5.603l5.587 19.077v-5.603zm38.154 0l-5.587 19.077v5.603l5.587-19.077z"
      />
      <path
        fill="#F47E82"
        d="M1068.732 736.34l5.587 19.077-5.587 19.077h38.154l-5.587-19.077 5.587-19.077z"
      />
      <path
        fill="url(#rectangle_svg__d)"
        d="M9.067 30.578c0 3.057 3.084 5.535 6.888 5.535s6.888-2.478 6.888-5.535c0-3.056-3.084-5.534-6.888-5.534s-6.888 2.478-6.888 5.534"
        transform="translate(992 736)"
      />
      <use
        fillRule="nonzero"
        stroke="currentColor"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#rectangle_svg__e)"
        xlinkHref="#rectangle_svg__a"
      />
    </g>
  </svg>
);

export default SvgRectangle;
