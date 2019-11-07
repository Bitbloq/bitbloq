import React from "react";

const SvgButtonPressed = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <path id="buttonPressed_svg__d" d="M0 1.395h133.14v115.27H0z" />
      <path id="buttonPressed_svg__f" d="M0 1.395h133.14v74.4H0z" />
      <path id="buttonPressed_svg__a" d="M306 1035h376v220H306z" />
      <filter
        id="buttonPressed_svg__c"
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
        id="buttonPressed_svg__b"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <mask
        id="buttonPressed_svg__h"
        width={376}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#buttonPressed_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-316 -1045)">
      <path stroke="#000" strokeWidth={2} d="M78 1004h649v301H78z" />
      <g fillRule="nonzero" transform="translate(316 1045)">
        <use fill="#FFF" xlinkHref="#buttonPressed_svg__b" />
        <use
          fill="#000"
          filter="url(#buttonPressed_svg__c)"
          xlinkHref="#buttonPressed_svg__b"
        />
      </g>
      <g transform="translate(349 1102.161)">
        <mask id="buttonPressed_svg__e" fill="#fff">
          <use xlinkHref="#buttonPressed_svg__d" />
        </mask>
        <path
          fill="#4C4C4C"
          d="M133.14 38.595c0-20.547-29.803-37.2-66.57-37.2C29.805 1.395 0 18.048 0 38.595v40.87c0 20.546 29.804 37.2 66.57 37.2 36.767 0 66.57-16.654 66.57-37.2v-40.87z"
          mask="url(#buttonPressed_svg__e)"
        />
      </g>
      <g transform="translate(349 1102.161)">
        <mask id="buttonPressed_svg__g" fill="#fff">
          <use xlinkHref="#buttonPressed_svg__f" />
        </mask>
        <path
          fill="#2F302F"
          d="M133.14 38.595c0 20.546-29.803 37.2-66.573 37.2-36.763 0-66.566-16.654-66.566-37.2 0-20.547 29.803-37.2 66.566-37.2 36.77 0 66.574 16.653 66.574 37.2"
          mask="url(#buttonPressed_svg__g)"
        />
      </g>
      <path
        fill="#212121"
        d="M467.214 1138.756c0 16.118-23.12 29.183-51.646 29.183-28.52 0-51.644-13.065-51.644-29.183 0-16.118 23.124-29.184 51.644-29.184 28.527 0 51.646 13.066 51.646 29.184"
      />
      <path
        fill="#009EE1"
        d="M464.214 1099.185c0-15.013-21.776-27.183-48.646-27.183-26.864 0-48.644 12.17-48.644 27.183v37.42c0 15.01 21.78 27.183 48.644 27.183 26.87 0 48.646-12.173 48.646-27.183v-37.42z"
      />
      <path
        fill="#00B1E7"
        d="M464.214 1099.185c0 15.013-21.776 27.183-48.646 27.183-26.864 0-48.644-12.17-48.644-27.183s21.78-27.183 48.644-27.183c26.87 0 48.646 12.17 48.646 27.183"
      />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#buttonPressed_svg__h)"
        xlinkHref="#buttonPressed_svg__a"
      />
    </g>
  </svg>
);

export default SvgButtonPressed;
