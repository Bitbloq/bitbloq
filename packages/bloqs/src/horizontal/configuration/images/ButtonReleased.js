import React from "react";

const SvgButtonReleased = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <path id="buttonPressed_svg__a" d="M1004 1052h376v220h-376z" />
      <path id="buttonPressed_svg__e" d="M0 1.395h133.14v115.27H0z" />
      <path id="buttonPressed_svg__g" d="M0 1.395h133.14v74.4H0z" />
      <filter
        id="buttonPressed_svg__d"
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
        id="buttonPressed_svg__c"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <mask
        id="buttonPressed_svg__b"
        width={376}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#buttonPressed_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-1014 -1062)">
      <path stroke="#000" strokeWidth={2} d="M755 1004h667v301H755z" />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#buttonPressed_svg__b)"
        xlinkHref="#buttonPressed_svg__a"
      />
      <g fillRule="nonzero" transform="translate(1014 1062)">
        <use fill="#FFF" xlinkHref="#buttonPressed_svg__c" />
        <use
          fill="#000"
          filter="url(#buttonPressed_svg__d)"
          xlinkHref="#buttonPressed_svg__c"
        />
      </g>
      <g transform="translate(1047 1129.161)">
        <mask id="buttonPressed_svg__f" fill="#fff">
          <use xlinkHref="#buttonPressed_svg__e" />
        </mask>
        <path
          fill="#4C4C4C"
          d="M133.14 38.595c0-20.547-29.803-37.2-66.57-37.2C29.805 1.395 0 18.048 0 38.595v40.87c0 20.546 29.804 37.2 66.57 37.2 36.767 0 66.57-16.654 66.57-37.2v-40.87z"
          mask="url(#buttonPressed_svg__f)"
        />
      </g>
      <g transform="translate(1047 1129.161)">
        <mask id="buttonPressed_svg__h" fill="#fff">
          <use xlinkHref="#buttonPressed_svg__g" />
        </mask>
        <path
          fill="#2F302F"
          d="M133.14 38.595c0 20.546-29.803 37.2-66.573 37.2-36.763 0-66.566-16.654-66.566-37.2 0-20.547 29.803-37.2 66.566-37.2 36.77 0 66.574 16.653 66.574 37.2"
          mask="url(#buttonPressed_svg__h)"
        />
      </g>
      <path
        fill="#212121"
        d="M1165.214 1165.756c0 16.118-23.12 29.183-51.646 29.183-28.52 0-51.644-13.065-51.644-29.183 0-16.118 23.124-29.184 51.644-29.184 28.527 0 51.646 13.066 51.646 29.184"
      />
      <path
        fill="#009EE1"
        d="M1162.29 1106.183c0-15.013-21.777-27.183-48.647-27.183-26.863 0-48.643 12.17-48.643 27.183v37.42c0 15.01 21.78 27.184 48.643 27.184 26.87 0 48.647-12.174 48.647-27.184v-37.42z"
      />
      <path
        fill="#00B1E7"
        d="M1162.29 1106.183c0 15.014-21.777 27.184-48.647 27.184-26.863 0-48.643-12.17-48.643-27.184 0-15.013 21.78-27.183 48.643-27.183 26.87 0 48.647 12.17 48.647 27.183"
      />
    </g>
  </svg>
);

export default SvgButtonReleased;
