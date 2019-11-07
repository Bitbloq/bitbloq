import React from "react";

const SvgReceiveMessage = ({ letter, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <filter
        id="receive-message_svg__c"
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
        id="receive-message_svg__b"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <path id="receive-message_svg__a" d="M132 3358h568v220H132z" />
      <mask
        id="receive-message_svg__d"
        width={568}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#receive-message_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-142 -3368)">
      <path stroke="#000" strokeWidth={2} d="M74 3241h690v413H74z" />
      <g fillRule="nonzero" transform="translate(142 3368)">
        <use fill="#FFF" xlinkHref="#receive-message_svg__b" />
        <use
          fill="#000"
          filter="url(#receive-message_svg__c)"
          xlinkHref="#receive-message_svg__b"
        />
      </g>
      <path fill="#E6E6E6" d="M180 3557.23h123.956v-76.708H180z" />
      <path fill="#CCC" d="M180 3557.582h123.956l-61.978-70.017z" />
      <path fill="#E6E6E6" d="M180 3557.397h123.956l-61.978-62.006z" />
      <path fill="#CCC" d="M180 3480.522l61.978 41.7 61.978-41.7z" />
      <path fill="#E6E6E6" d="M180 3480.522l61.978 38.354 61.978-38.354z" />
      <path
        fill="red"
        d="M275.847 3511.738c-9.746 0-17.674 7.929-17.674 17.674 0 9.746 7.928 17.674 17.674 17.674 9.746 0 17.674-7.928 17.674-17.674 0-9.745-7.928-17.674-17.674-17.674m0 37.608c-10.992 0-19.934-8.942-19.934-19.934 0-10.991 8.942-19.934 19.934-19.934s19.934 8.943 19.934 19.934c0 10.992-8.942 19.934-19.934 19.934"
      />
      <text
        x="276"
        y="3530"
        fill="red"
        fontFamily="Roboto"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="central"
      >
        {letter}
      </text>
      <path
        fill="#000"
        d="M264.038 3432.19a4.324 4.324 0 010 6.114l-19.155 19.154c-.05.05-.102.1-.155.148l-.076.066-.084.072c-.032.027-.066.052-.1.078l-.065.05c-.037.028-.075.054-.112.08l-.06.042c-.038.026-.078.05-.117.075l-.06.038a4.192 4.192 0 01-.118.068l-.068.037a4.97 4.97 0 01-.295.144l-.092.04-.093.037-.108.04c-.027.01-.055.02-.083.028l-.12.04-.074.02a4.135 4.135 0 01-.131.036l-.069.016-.137.03-.07.012-.137.023-.082.01c-.042.006-.084.012-.126.016l-.112.008c-.033.003-.066.006-.099.007a4.41 4.41 0 01-.428 0c-.033-.001-.066-.004-.1-.007l-.11-.008c-.043-.004-.085-.01-.127-.015l-.082-.01-.136-.024-.07-.012a4.321 4.321 0 01-.138-.03l-.068-.016a4.135 4.135 0 01-.132-.036l-.073-.02-.121-.04-.083-.028-.107-.04-.093-.037-.093-.04a4.162 4.162 0 01-.183-.086l-.112-.058-.067-.037a4.192 4.192 0 01-.118-.068l-.06-.038a4.392 4.392 0 01-.118-.075l-.06-.041-.112-.08-.065-.051-.1-.078-.084-.072-.076-.066a4.528 4.528 0 01-.155-.147l-19.155-19.155a4.324 4.324 0 016.114-6.115l11.775 11.774v-37.682a4.324 4.324 0 018.647 0v37.682l11.774-11.774a4.323 4.323 0 016.114 0zm-22.4-36.847a4.323 4.323 0 01-4.323-4.324v-8.696a4.324 4.324 0 018.647 0v8.696a4.323 4.323 0 01-4.324 4.324z"
      />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#receive-message_svg__d)"
        xlinkHref="#receive-message_svg__a"
      />
    </g>
  </svg>
);

export default SvgReceiveMessage;
