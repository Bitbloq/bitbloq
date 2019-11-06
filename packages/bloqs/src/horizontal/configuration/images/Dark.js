import React from "react";

const SvgDark = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <filter
        id="dark_svg__c"
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
        id="dark_svg__g"
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
      <rect id="dark_svg__b" width={198} height={198} rx={10} />
      <rect id="dark_svg__h" width={198} height={198} rx={10} />
      <path id="dark_svg__e" d="M0 .25h199.724v115.807H0z" />
      <path id="dark_svg__a" d="M807 1947h369v220H807z" />
      <mask id="dark_svg__i" width={369} height={220} x={0} y={0} fill="#fff">
        <use xlinkHref="#dark_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-817 -1957)">
      <path stroke="#000" strokeWidth={2} d="M690 1833h549v413H690z" />
      <g transform="translate(818 1958)">
        <mask id="dark_svg__d" fill="#fff">
          <use xlinkHref="#dark_svg__b" />
        </mask>
        <g fillRule="nonzero">
          <use fill="#FFF" xlinkHref="#dark_svg__b" />
          <use
            fill="#000"
            filter="url(#dark_svg__c)"
            xlinkHref="#dark_svg__b"
          />
        </g>
        <path
          fill="#111249"
          d="M-1 198.724h199.724V-1H-1z"
          mask="url(#dark_svg__d)"
        />
        <g mask="url(#dark_svg__d)">
          <g transform="translate(-1 82.667)">
            <mask id="dark_svg__f" fill="#fff">
              <use xlinkHref="#dark_svg__e" />
            </mask>
            <path
              fill="#006830"
              d="M199.724 116.057V.25C122.512 1.31 52.512 15.343 0 37.697v78.36h199.724z"
              mask="url(#dark_svg__f)"
            />
          </g>
          <path
            fill="#ACAED5"
            d="M62.57 66.574c-9.398 0-17.016-8.021-17.016-17.915 0-9.894 7.618-17.915 17.015-17.915 2.749 0 5.345.687 7.643 1.906-4.585-5.49-11.48-8.984-19.192-8.984-13.803 0-24.993 11.19-24.993 24.993 0 13.803 11.19 24.993 24.993 24.993 7.712 0 14.607-3.494 19.192-8.984a16.256 16.256 0 01-7.643 1.906"
          />
          <path
            fill="#FFF"
            d="M161.751 36.528a.671.671 0 11-1.342 0 .671.671 0 011.342 0m-55.909 33.451a.671.671 0 11-1.342 0 .671.671 0 011.342 0M27.37 90.745a.671.671 0 11-1.342 0 .671.671 0 011.342 0m72.163-70.576a.671.671 0 11-1.342 0 .671.671 0 011.342 0m26.603 23.849a.671.671 0 11-1.342 0 .671.671 0 011.342 0m-25.931-14.45a.671.671 0 11-1.343 0 .671.671 0 011.343 0M23.682 67.564a.671.671 0 110-1.342.671.671 0 010 1.342M11.505 17.743a.671.671 0 110-1.342.671.671 0 010 1.342m49.81-6.309a.671.671 0 110-1.342.671.671 0 010 1.342m91.858 56.13a.671.671 0 110-1.342.671.671 0 010 1.342m17.351-.671a.671.671 0 110-1.343.671.671 0 010 1.343"
          />
        </g>
        <g fill="#000" fillRule="nonzero" mask="url(#dark_svg__d)">
          <use filter="url(#dark_svg__g)" xlinkHref="#dark_svg__h" />
        </g>
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#dark_svg__i)"
        xlinkHref="#dark_svg__a"
      />
    </g>
  </svg>
);

export default SvgDark;
