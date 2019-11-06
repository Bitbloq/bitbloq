import React from "react";

const SvgTemperatureHot = props => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <path id="temperature-hot_svg__d" d="M0 .306h73.387V178.6H0z" />
      <path id="temperature-hot_svg__a" d="M267 2879h376v220H267z" />
      <filter
        id="temperature-hot_svg__c"
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
        id="temperature-hot_svg__b"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <mask
        id="temperature-hot_svg__f"
        width={376}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#temperature-hot_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-277 -2889)">
      <path stroke="#000" strokeWidth={2} d="M81 2766h621v413H81z" />
      <g fillRule="nonzero" transform="translate(277 2889)">
        <use fill="#FFF" xlinkHref="#temperature-hot_svg__b" />
        <use
          fill="#000"
          filter="url(#temperature-hot_svg__c)"
          xlinkHref="#temperature-hot_svg__b"
        />
      </g>
      <g transform="translate(340 2899.394)">
        <mask id="temperature-hot_svg__e" fill="#fff">
          <use xlinkHref="#temperature-hot_svg__d" />
        </mask>
        <path
          fill="#CDCDCD"
          d="M36.693.306c-10.656 0-19.295 8.639-19.295 19.295v91.096C6.958 117.166 0 128.721 0 141.906c0 20.265 16.428 36.693 36.693 36.693 20.266 0 36.694-16.428 36.694-36.693 0-13.185-6.958-24.74-17.399-31.209V19.601C55.988 8.945 47.35.306 36.693.306"
          mask="url(#temperature-hot_svg__e)"
        />
      </g>
      <path
        fill="#FFF"
        d="M391.93 3016.64l-3.646-2.259v-95.386c0-6.391-5.2-11.59-11.59-11.59-6.392 0-11.592 5.199-11.592 11.59v95.386l-3.646 2.26c-8.611 5.334-13.751 14.553-13.751 24.659 0 15.985 13.004 28.99 28.989 28.99 15.984 0 28.988-13.005 28.988-28.99 0-10.106-5.14-19.325-13.751-24.66"
      />
      <path
        fill="red"
        fillOpacity={0.7}
        d="M376.693 2925.115c-5.232 0-9.49 4.257-9.49 9.49v80.946l-4.64 2.876c-7.989 4.949-12.758 13.5-12.758 22.873 0 14.826 12.062 26.888 26.888 26.888 14.826 0 26.888-12.062 26.888-26.888 0-9.373-4.769-17.924-12.757-22.873l-4.641-2.876v-80.947c0-5.232-4.257-9.49-9.49-9.49"
      />
      <path
        fill="#FFF"
        d="M394.343 3034.62a1.75 1.75 0 01-1.58-.995c-2.958-6.162-9.284-10.144-16.116-10.144a1.75 1.75 0 110-3.502c8.17 0 15.736 4.762 19.273 12.131a1.75 1.75 0 01-1.577 2.51"
      />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#temperature-hot_svg__f)"
        xlinkHref="#temperature-hot_svg__a"
      />
    </g>
  </svg>
);

export default SvgTemperatureHot;
