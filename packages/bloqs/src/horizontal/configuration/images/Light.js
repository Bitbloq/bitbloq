import React from "react";

const SvgLight = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <filter
        id="light_svg__c"
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
      <filter
        id="light_svg__g"
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
      <rect id="light_svg__b" width={198} height={198} rx={10} />
      <rect id="light_svg__h" width={198} height={198} rx={10} />
      <path id="light_svg__e" d="M0 .25h199.724v115.807H0z" />
      <path id="light_svg__a" d="M196 1947h369v220H196z" />
      <mask id="light_svg__i" width={369} height={220} x={0} y={0} fill="#fff">
        <use xlinkHref="#light_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-206 -1957)">
      <path stroke="#000" strokeWidth={2} d="M79 1833h549v413H79z" />
      <g transform="translate(207 1958)">
        <mask id="light_svg__d" fill="#fff">
          <use xlinkHref="#light_svg__b" />
        </mask>
        <g fillRule="nonzero">
          <use fill="#FFF" xlinkHref="#light_svg__b" />
          <use
            fill="#000"
            filter="url(#light_svg__c)"
            xlinkHref="#light_svg__b"
          />
        </g>
        <g mask="url(#light_svg__d)">
          <path fill="#29ABE2" d="M-1 198.724h199.724V-1H-1z" />
          <g transform="translate(-1 82.667)">
            <mask id="light_svg__f" fill="#fff">
              <use xlinkHref="#light_svg__e" />
            </mask>
            <path
              fill="#009245"
              d="M199.724 116.057V.25C122.512 1.31 52.512 15.343 0 37.697v78.36h199.724z"
              mask="url(#light_svg__f)"
            />
          </g>
          <path
            fill="#F9D64F"
            d="M51.564 30.222a18.855 18.855 0 00-6.841-.009l.91-5.188 7.225-6.182 1.248-7.894 1.385 8.77-4.417 7.404.49 3.1zm-6.889 36.874a18.855 18.855 0 006.841.009l-.91 5.189-7.225 6.18-1.248 7.895-1.386-8.77 4.418-7.404-.49-3.1zm33.26-13.699l7.895 1.248-8.77 1.386-7.405-4.417-3.099.49a18.855 18.855 0 00.01-6.842l5.188.91 6.181 7.225zm-48.252-8.182a18.855 18.855 0 00-.01 6.84l-5.188-.91-6.181-7.225-7.895-1.247 8.77-1.386 7.405 4.417 3.099-.49zm32.478-8.986a18.87 18.87 0 00-3.402-3.014l2.764-1.939 6.44.502 4.392-3.193-3.547 4.878-5.68 1.435-.967 1.331zM34.078 61.09a18.859 18.859 0 003.402 3.014l-2.764 1.939-6.44-.502-4.392 3.193 3.547-4.878 5.68-1.435.967-1.332zm26.47 1.611a18.859 18.859 0 003.015-3.401l1.94 2.764-.502 6.44 3.193 4.391-4.878-3.547-1.435-5.679-1.332-.968zM35.69 34.618a18.87 18.87 0 00-3.014 3.401l-1.94-2.764.502-6.44-3.193-4.391 4.878 3.546 1.435 5.68 1.332.968zM48.12 64.35c8.665 0 15.69-7.026 15.69-15.69 0-8.666-7.025-15.691-15.69-15.691-8.666 0-15.69 7.025-15.69 15.69s7.024 15.69 15.69 15.69"
          />
        </g>
        <g fill="#000" fillRule="nonzero" mask="url(#light_svg__d)">
          <use filter="url(#light_svg__g)" xlinkHref="#light_svg__h" />
        </g>
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#light_svg__i)"
        xlinkHref="#light_svg__a"
      />
    </g>
  </svg>
);

export default SvgLight;
