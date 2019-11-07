import React from "react";

const SvgObstacle = ({ closed, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 484 200" {...props}>
    <defs>
      <path id="obstacle_svg__d" d="M.184.064h151.19v79.26H.184z" />
      <path
        id="obstacle_svg__g"
        d="M1.34 31.6a22.623 22.623 0 00-1.206 4.062c.269 1.376.675 2.73 1.207 4.062 7.165 17.931 37.569 31.4 73.993 31.4 36.424 0 66.829-13.469 73.994-31.4a22.64 22.64 0 001.207-4.062 22.64 22.64 0 00-1.207-4.061C142.163 13.669 111.758.199 75.334.199S8.506 13.669 1.341 31.601"
      />
      <path
        id="obstacle_svg__i"
        d="M.006 26.577c0 14.567 11.84 26.376 26.445 26.376s26.445-11.809 26.445-26.376c0-14.566-11.84-26.375-26.445-26.375S.006 12.011.006 26.577"
      />
      <path id="obstacle_svg__l" d="M0 .206h98.145v45.75H0z" />
      <path id="obstacle_svg__a" d="M279 2337h504v320H279z" />
      <radialGradient
        id="obstacle_svg__j"
        r="50.133%"
        fx="50%"
        fy="50%"
        gradientTransform="matrix(.99735 0 0 1 .001 0)"
      >
        <stop offset="0%" stopColor="#00ABE5" />
        <stop offset="100%" stopColor="#272D95" />
      </radialGradient>
      <linearGradient id="obstacle_svg__f" x1="45.985%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="#FFCDCD" />
        <stop offset="54.015%" stopColor="#FFE8E8" />
        <stop offset="100%" stopColor="#FFCDCD" />
      </linearGradient>
      <filter
        id="obstacle_svg__c"
        width="101.2%"
        height="103%"
        x="-.6%"
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
      <rect id="obstacle_svg__b" width={482} height={198} x={1} y={1} rx={10} />
      <mask
        id="obstacle_svg__n"
        width={504}
        height={320}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#obstacle_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-289 -2347)">
      <path stroke="#000" strokeWidth={2} d="M75 2296h753v413H75z" />
      <g fillRule="nonzero" transform="translate(289 2347)">
        <use fill="#FFF" xlinkHref="#obstacle_svg__b" />
        <use
          fill="#000"
          filter="url(#obstacle_svg__c)"
          xlinkHref="#obstacle_svg__b"
        />
      </g>
      <g transform="translate(331 2395)">
        {!closed && (
          <>
            <g transform="translate(0 13.794)">
              <mask id="obstacle_svg__e" fill="#fff">
                <use xlinkHref="#obstacle_svg__d" />
              </mask>
              <path
                fill="#F1CAC1"
                d="M75.779 79.323c45.968 0 75.595-23.936 75.595-35.567 0 0-12.486-43.692-75.595-43.692C12.669.064.184 43.756.184 43.756c0 11.63 29.626 35.567 75.595 35.567"
                mask="url(#obstacle_svg__e)"
              />
            </g>
            <path
              fill="url(#obstacle_svg__f)"
              d="M149.772 39.799c-7.165-17.932-37.57-31.402-73.993-31.402-36.425 0-66.83 13.47-73.994 31.402A22.617 22.617 0 00.578 43.86a22.618 22.618 0 001.207 4.062c7.165 17.932 37.57 31.401 73.994 31.401s66.828-13.47 73.993-31.401c.532-1.33.938-2.685 1.207-4.062a22.599 22.599 0 00-1.207-4.061"
              transform="translate(0 13.794)"
            />
            <g transform="translate(.444 21.992)">
              <mask id="obstacle_svg__h" fill="#fff">
                <use xlinkHref="#obstacle_svg__g" />
              </mask>
              <path
                fill="#FFF"
                d="M119.549 35.662c0 23.135-18.805 41.89-42 41.89-23.197 0-42.001-18.755-42.001-41.89s18.804-41.89 42-41.89 42 18.755 42 41.89"
                mask="url(#obstacle_svg__h)"
              />
            </g>
            <g transform="translate(51.542 31.077)">
              <mask id="obstacle_svg__k" fill="#fff">
                <use xlinkHref="#obstacle_svg__i" />
              </mask>
              <path
                fill="url(#obstacle_svg__j)"
                d="M.006 26.577c0 14.567 11.84 26.376 26.445 26.376s26.445-11.809 26.445-26.376c0-14.566-11.84-26.375-26.445-26.375S.006 12.011.006 26.577"
                mask="url(#obstacle_svg__k)"
              />
            </g>
            <g fill="#000">
              <path d="M93.76 57.654c0 8.685-7.06 15.725-15.767 15.725-8.708 0-15.767-7.04-15.767-15.725 0-8.685 7.059-15.725 15.767-15.725 8.707 0 15.767 7.04 15.767 15.725" />
              <path
                fillRule="nonzero"
                d="M152.178 57.421l.046.233-.046.233a23.81 23.81 0 01-1.27 4.28c-7.49 18.742-38.728 32.169-75.13 32.169-36.401 0-67.64-13.427-75.128-32.17a23.828 23.828 0 01-1.271-4.28l-.045-.232.045-.233c.28-1.438.706-2.865 1.27-4.28C8.14 34.4 39.378 20.972 75.78 20.972c36.401 0 67.64 13.427 75.128 32.17a23.81 23.81 0 011.271 4.28zm-3.54-3.377c-7.035-17.606-37.347-30.634-72.86-30.634-35.512 0-65.823 13.028-72.858 30.634a21.497 21.497 0 00-1.095 3.61c.25 1.208.616 2.412 1.095 3.61C9.955 78.87 40.266 91.898 75.78 91.898c35.512 0 65.824-13.028 72.858-30.634a21.476 21.476 0 001.095-3.61 21.476 21.476 0 00-1.095-3.61z"
              />
            </g>
            <path
              stroke="#373A44"
              strokeDasharray="10,10"
              strokeLinecap="round"
              strokeWidth={3}
              d="M165.53 53.983h121.935"
            />
            <circle
              cx={226.515}
              cy={53.788}
              r={15.152}
              fill="#FFF"
              fillRule="nonzero"
              stroke="#373A44"
              strokeWidth={2}
            />
            <path
              d="M223.707 56.31l-3.45-3.452a.935.935 0 00-1.321 0l-1.238 1.239a.933.933 0 000 1.32l5.349 5.35a.935.935 0 001.32 0l10.965-10.965a.933.933 0 000-1.32l-1.238-1.24a.934.934 0 00-1.32 0l-9.067 9.067z"
              fill="#7AC943"
              fillRule="nonzero"
            />
          </>
        )}
        <g transform="translate(301.515 57.496)">
          <mask id="obstacle_svg__m" fill="#fff">
            <use xlinkHref="#obstacle_svg__l" />
          </mask>
          <path
            fill="#D76E00"
            d="M98.057 36.2L92.819 4.66A5.322 5.322 0 0087.57.206h-77A5.322 5.322 0 005.32 4.66L.083 36.2c-.144.864-.055 3.96-.066 4.16-.158 2.999 2.233 5.596 5.314 5.596h87.478c3.015 0 5.369-2.488 5.32-5.406-.004-.262.07-3.486-.072-4.35"
            mask="url(#obstacle_svg__m)"
          />
        </g>
        <path
          fill="#FFAB6E"
          d="M394.327 99.898h-87.478c-3.287 0-5.787-2.955-5.248-6.202l5.238-31.54a5.322 5.322 0 015.248-4.453h77.002a5.321 5.321 0 015.247 4.453l5.238 31.54c.54 3.247-1.96 6.202-5.247 6.202"
        />
        <path
          fill="#FF9400"
          d="M361.152 3.605C359.93 1.537 355.324 0 349.83 0c-5.625 0-10.318 1.611-11.404 3.753-.155.306-22.532 64.977-22.532 71.485 0 7.567 15.194 13.703 33.936 13.703 18.743 0 33.936-6.136 33.936-13.703 0-6.508-22.405-71.282-22.613-71.633"
        />
        <path
          fill="#FFD5A4"
          d="M349.83 72.381c16.59 0 30.045-5.42 30.105-12.113-1.561-5.143-3.465-11.123-5.457-17.235.032.234.05.43.05.58 0 5.508-11.058 9.973-24.698 9.973s-24.698-4.465-24.698-9.973c0-.153.017-.351.05-.589-1.991 6.113-3.896 12.097-5.458 17.243.058 6.694 13.513 12.114 30.106 12.114"
        />
        <path
          fill="#D76E00"
          d="M360.389 4.366c0 2.1-4.728 3.803-10.56 3.803-5.832 0-10.559-1.702-10.559-3.803 0-2.1 4.727-3.803 10.56-3.803 5.83 0 10.559 1.703 10.559 3.803"
        />
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#obstacle_svg__n)"
        xlinkHref="#obstacle_svg__a"
      />
    </g>
    {closed && (
      <g fill="none" fillRule="evenodd" transform="translate(-1093 -2347)">
        <path
          fill="#E6C9C0"
          d="M1287.301 2448.351c0 22.158-34.264 40.12-76.532 40.12-42.267 0-76.532-17.962-76.532-40.12 0 0 34.265-44.351 76.532-44.351 42.268 0 76.532 44.351 76.532 44.351"
        />
        <path
          fill="#000"
          d="M1210.77 2489.709c-17.848 0-35.268-3.272-49.054-9.213-13.754-5.927-23.345-14.252-27.007-23.442a24.346 24.346 0 01-1.286-4.344l-.014-.08c-.234-1.466-.418-2.623-.409-4.286a1.237 1.237 0 012.474.014c-.008 1.46.146 2.423.378 3.881l.003.019c.253 1.29.64 2.595 1.153 3.88 7.18 18.019 38.201 31.097 73.761 31.097 35.56 0 66.581-13.078 73.762-31.096.512-1.285.9-2.59 1.152-3.879.23-1.476.38-2.549.38-3.909a1.237 1.237 0 012.475 0c0 1.543-.172 2.761-.414 4.314l-.008.045a24.347 24.347 0 01-1.287 4.344c-3.662 9.19-13.253 17.515-27.007 23.442-13.785 5.94-31.206 9.213-49.053 9.213"
        />
        <path
          stroke="#373A44"
          strokeDasharray="10,10"
          strokeLinecap="round"
          strokeWidth={3}
          d="M1299.389 2449.257H1362"
        />
        <circle
          cx={1361.5}
          cy={2448.5}
          r={15.5}
          fill="#FFF"
          fillRule="nonzero"
          stroke="#373A44"
          strokeWidth={2}
        />
        <path
          d="M1371.677 2441.873v.174l-6.306 6.306 6.303 6.303-3.018 3.018-6.303-6.303-6.306 6.306h-.174l-2.873-2.873v-.174l6.306-6.306-6.303-6.303 3.018-3.018 6.303 6.303 6.306-6.306h.174z"
          fill="#DF0000"
        />
      </g>
    )}
  </svg>
);

export default SvgObstacle;
