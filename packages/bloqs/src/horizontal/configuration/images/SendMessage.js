import React from "react";

const SvgSendMessage = ({ letter, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 200 200" {...props}>
    <defs>
      <filter
        id="send-message_svg__c"
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
        id="send-message_svg__b"
        width={198}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <path id="send-message_svg__a" d="M147 5172h568v220H147z" />
      <mask
        id="send-message_svg__d"
        width={568}
        height={220}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#send-message_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-157 -5182)">
      <path stroke="#000" strokeWidth={2} d="M89 5055h690v413H89z" />
      <g fillRule="nonzero" transform="translate(157 5182)">
        <use fill="#FFF" xlinkHref="#send-message_svg__b" />
        <use
          fill="#000"
          filter="url(#send-message_svg__c)"
          xlinkHref="#send-message_svg__b"
        />
      </g>
      <path fill="#E6E6E6" d="M195 5371.23h123.956v-76.708H195z" />
      <path fill="#CCC" d="M195 5371.582h123.956l-61.978-70.017z" />
      <path fill="#E6E6E6" d="M195 5371.397h123.956l-61.978-62.006z" />
      <path fill="#CCC" d="M195 5294.522l61.978 41.7 61.978-41.7z" />
      <path fill="#E6E6E6" d="M195 5294.522l61.978 38.354 61.978-38.354z" />
      <path
        fill="red"
        d="M290.847 5325.738c-9.746 0-17.674 7.929-17.674 17.674 0 9.746 7.928 17.674 17.674 17.674 9.746 0 17.674-7.928 17.674-17.674 0-9.745-7.928-17.674-17.674-17.674m0 37.608c-10.992 0-19.934-8.942-19.934-19.934 0-10.991 8.942-19.934 19.934-19.934s19.934 8.943 19.934 19.934c0 10.992-8.942 19.934-19.934 19.934"
      />
      <text
        x="291"
        y="5344"
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
        d="M279.038 5218.535a4.324 4.324 0 000-6.114l-19.155-19.154a4.29 4.29 0 00-.155-.148l-.076-.066c-.028-.024-.055-.049-.084-.072-.032-.027-.066-.052-.1-.078l-.065-.051c-.037-.028-.075-.054-.112-.08l-.06-.041a4.392 4.392 0 00-.117-.076l-.06-.037a4.192 4.192 0 00-.118-.068l-.068-.038c-.037-.02-.075-.038-.112-.057a4.97 4.97 0 00-.183-.086l-.092-.04-.093-.037c-.036-.014-.072-.028-.108-.04l-.083-.029-.12-.039-.074-.02a4.135 4.135 0 00-.131-.036l-.069-.016a4.401 4.401 0 00-.137-.03l-.07-.012c-.046-.008-.091-.017-.137-.023l-.082-.01c-.042-.006-.084-.012-.126-.016-.037-.004-.075-.006-.112-.008l-.099-.008a4.41 4.41 0 00-.428 0l-.1.008c-.036.002-.073.004-.11.008-.043.004-.085.01-.127.015l-.082.01-.136.024-.07.012-.138.03-.068.016a4.135 4.135 0 00-.132.036l-.073.02-.121.04-.083.027-.107.04-.093.038-.093.04a4.162 4.162 0 00-.183.086c-.037.019-.075.037-.112.057l-.067.038c-.04.022-.08.044-.118.068l-.06.037c-.04.025-.08.05-.118.076l-.06.041c-.037.026-.075.052-.112.08l-.065.05c-.034.027-.067.052-.1.08-.029.022-.056.047-.084.071l-.076.066a4.528 4.528 0 00-.155.147l-19.155 19.155a4.324 4.324 0 006.114 6.114l11.775-11.774v37.682a4.324 4.324 0 008.647 0v-37.682l11.774 11.774a4.323 4.323 0 006.114 0zm-22.4 36.847a4.323 4.323 0 00-4.323 4.324v8.695a4.324 4.324 0 008.647 0v-8.695a4.323 4.323 0 00-4.324-4.324z"
      />
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#send-message_svg__d)"
        xlinkHref="#send-message_svg__a"
      />
    </g>
  </svg>
);

export default SvgSendMessage;
