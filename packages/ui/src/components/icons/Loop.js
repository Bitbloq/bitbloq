import React from "react";

const SvgLoop = props => (
  <svg width="1em" height="1em" viewBox="0 0 30 30" {...props}>
    <defs>
      <path id="loop_svg__a" d="M168 261h328v112H168z" />
      <mask id="loop_svg__b" width={328} height={112} x={0} y={0} fill="#fff">
        <use xlinkHref="#loop_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-199 -300)">
      <path stroke="#000" strokeWidth={2} d="M71 78h524v400H71z" />
      <use
        fillRule="nonzero"
        stroke="currentColor"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#loop_svg__b)"
        xlinkHref="#loop_svg__a"
      />
      <path
        fill="#DDD"
        fillRule="nonzero"
        d="M194 287h50v60h-50c-5.523 0-10-4.477-10-10v-40c0-5.523 4.477-10 10-10z"
      />
      <rect
        width={130}
        height={66}
        x={181}
        y={284}
        stroke="#979797"
        strokeWidth={6}
        rx={10}
      />
      <path
        fill="#EEE"
        fillRule="nonzero"
        d="M194 285h50v60h-50c-5.523 0-10-4.477-10-10v-40c0-5.523 4.477-10 10-10z"
      />
      <path
        fill="currentColor"
        d="M213.171 318.466l3.883 3.884a.45.45 0 010 .636l-3.886 3.882a.452.452 0 01-.638 0l-.93-.929a.45.45 0 010-.637l1.446-1.443h-5.173c-4.84 0-8.79-3.892-8.872-8.707-.085-4.957 4.065-9.014 9.03-9.014h.704a.45.45 0 01.45.45v1.48a.45.45 0 01-.45.451h-.862c-3.54 0-6.427 2.846-6.488 6.367-.061 3.625 2.987 6.592 6.618 6.592h5.043l-1.445-1.445a.45.45 0 010-.637l.932-.93a.451.451 0 01.638 0zm6.956-12.324c4.84 0 8.789 3.891 8.872 8.706.085 4.957-4.065 9.014-9.03 9.014h-.704a.45.45 0 01-.45-.45v-1.48a.45.45 0 01.45-.45h.862c3.54 0 6.427-2.847 6.487-6.368.062-3.625-2.986-6.591-6.617-6.591h-5.043l1.445 1.444a.45.45 0 010 .636l-.932.932a.452.452 0 01-.638 0l-3.883-3.884a.45.45 0 010-.637l3.886-3.882a.451.451 0 01.638 0l.93.93a.45.45 0 010 .636l-1.446 1.444h5.173z"
      />
    </g>
  </svg>
);

export default SvgLoop;
