import React from "react";

const SvgLess = props => (
  <svg width="1em" height="1em" viewBox="0 0 30 30" {...props}>
    <defs>
      <path id="less_svg__a" d="M732 3772h392v206H732z" />
      <mask id="less_svg__b" width={392} height={206} x={0} y={0} fill="#fff">
        <use xlinkHref="#less_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-763 -3858)">
      <path stroke="#000" strokeWidth={2} d="M483 3712h702v297H483z" />
      <g transform="translate(748 3831)">
        <path
          fill="#DDD"
          fillRule="nonzero"
          d="M10 14h50v60H10C4.477 74 0 69.523 0 64V24c0-5.523 4.477-10 10-10z"
        />
        <rect
          width={194}
          height={66}
          x={-3}
          y={11}
          stroke="#979797"
          strokeWidth={6}
          rx={10}
        />
        <path
          fill="#EEE"
          fillRule="nonzero"
          d="M10 12h50v60H10C4.477 72 0 67.523 0 62V22c0-5.523 4.477-10 10-10z"
        />
        <path
          d="M41.898 52.462H18.102a.794.794 0 01-.794-.794v-5.41c0-.436.355-.791.794-.791h23.796c.439 0 .794.355.794.791v5.41a.794.794 0 01-.794.794zm0-14H18.102a.794.794 0 01-.794-.794v-5.41c0-.436.355-.791.794-.791h23.796c.439 0 .794.355.794.791v5.41a.794.794 0 01-.794.794z"
          fill="#3B3E45"
        />
      </g>
      <use
        fillRule="nonzero"
        stroke="currentColor"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#less_svg__b)"
        xlinkHref="#less_svg__a"
      />
    </g>
  </svg>
);

export default SvgLess;
