import React from "react";

const SvgServoPosition = ({ value, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 150 130" {...props}>
    <defs>
      <filter
        id="servo-position_svg__c"
        width="104.1%"
        height="104.7%"
        x="-2%"
        y="-2.3%"
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
        id="servo-position_svg__b"
        width={148}
        height={128}
        x={281}
        y={6831}
        rx={10}
      />
      <path id="servo-position_svg__a" d="M269 6820h172v237H269z" />
      <mask
        id="servo-position_svg__d"
        width={172}
        height={237}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#servo-position_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-280 -6830)">
      <path stroke="#000" strokeWidth={2} d="M87 6790h371v297H87z" />
      <g fillRule="nonzero">
        <use fill="#FFF" xlinkHref="#servo-position_svg__b" />
        <use
          fill="#000"
          filter="url(#servo-position_svg__c)"
          xlinkHref="#servo-position_svg__b"
        />
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#servo-position_svg__d)"
        xlinkHref="#servo-position_svg__a"
      />
      <text fill="#373B44" fontFamily="Roboto-Regular, Roboto" fontSize={30}>
        <tspan x={331.335} y={6868}>
          {`${value}\xBA`}
        </tspan>
      </text>
      <path
        fill="#000"
        fillRule="nonzero"
        d="M306.035 6933.006a.5.5 0 01-.173.986l-10.45-1.85a.5.5 0 01.173-.987l10.45 1.851zm-8.002-11.111a.501.501 0 01.34-.94l9.976 3.646a.501.501 0 01-.341.94l-9.975-3.646zm14.08-5.154c.238.138.32.444.182.684a.497.497 0 01-.68.183l-9.19-5.328a.502.502 0 01-.182-.684.497.497 0 01.68-.183l9.19 5.328zm31.905-34.224a.499.499 0 01.982-.174l1.842 10.494a.499.499 0 01-.982.174l-1.842-10.494zm11.484 9.64a.5.5 0 11-1 0V6881.5a.5.5 0 111 0v10.657zm-47.106 11.41a.502.502 0 01-.061-.705.497.497 0 01.702-.062l8.128 6.85c.21.177.238.493.061.705a.497.497 0 01-.702.061l-8.128-6.85zm14.97-.021a.502.502 0 01-.061.705.497.497 0 01-.703-.062l-6.82-8.163a.502.502 0 01.062-.705.497.497 0 01.702.061l6.82 8.164zm.992-13.66a.502.502 0 01.183-.683.497.497 0 01.68.183l5.306 9.23a.502.502 0 01-.183.683.497.497 0 01-.68-.183l-5.306-9.23zm14.068 5.107a.498.498 0 11-.937.342l-3.63-10.017a.498.498 0 11.937-.342l3.63 10.017zm55.029.39a.497.497 0 01.702-.062c.21.178.238.493.061.705l-6.82 8.163a.497.497 0 01-.702.062.502.502 0 01-.062-.706l6.82-8.162zm.02 15.033a.497.497 0 01-.701-.061.502.502 0 01.061-.705l8.128-6.85a.497.497 0 01.702.062.502.502 0 01-.061.705l-8.128 6.85zm-18.27-25.44a.498.498 0 11.936.342l-3.63 10.017a.498.498 0 11-.937-.343l3.63-10.016zm5.132 14.14a.497.497 0 01-.681.183.502.502 0 01-.183-.684l5.306-9.229a.497.497 0 01.68-.183c.239.138.32.445.183.684l-5.305 9.229zm34.078 32.04a.5.5 0 11.173.986l-10.45 1.85a.5.5 0 11-.173-.986l10.45-1.85zm-7.338-19.743a.497.497 0 01.68.183.502.502 0 01-.182.684l-9.19 5.328a.497.497 0 01-.68-.183.502.502 0 01.182-.684l9.19-5.328zm-5.084 14.128a.501.501 0 01-.34-.94l9.974-3.647a.501.501 0 01.34.94l-9.974 3.647zm-37.853-32.53a.499.499 0 11-.981-.173l1.843-10.494a.499.499 0 11.981.174l-1.843 10.493z"
      />
      <g transform={`rotate(${value - 90},355.5,6942.8)`}>
        <path
          fill="#006837"
          d="M357.492 6934.895c3.175.895 5.508 3.876 5.508 7.416 0 4.246-3.358 7.689-7.5 7.689-4.142 0-7.5-3.443-7.5-7.69 0-3.548 2.344-6.535 5.531-7.421v-37.95l1.981-2.939 1.98 2.939v37.956z"
        />
      </g>
    </g>
  </svg>
);

export default SvgServoPosition;
