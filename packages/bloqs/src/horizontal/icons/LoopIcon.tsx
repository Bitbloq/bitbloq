import React, { FC } from "react";
import { IBloq } from "../../index";

interface ILoopIconProps {
  bloq?: IBloq;
}

const LoopIcon: FC<ILoopIconProps> = ({ bloq }) => {
  const repeat: number | undefined =
    bloq && bloq.parameters && (bloq.parameters.repeat as number);

  if (!repeat) {
    return (
      <svg width="1em" height="1em" viewBox="0 0 54 54">
        <g fill="none" fillRule="evenodd" transform="translate(-187 -135)">
          <path fill="#FFF" d="M0 0h1151v696H0z" />
          <rect
            width={68}
            height={103}
            x={213}
            y={112}
            fill="#4D2E6A"
            fillRule="nonzero"
            rx={10}
          />
          <path
            fill="#6B4191"
            d="M173 155.2V128a3 3 0 013-3h74a3 3 0 013 3v26.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V202a3 3 0 01-3 3h-74a3 3 0 01-3-3v-27.2a11 11 0 006-9.8 11 11 0 00-6-9.8z"
          />
          <path
            fill="#8955B8"
            d="M173 152.2V125a3 3 0 013-3h74a3 3 0 013 3v29.252a8.003 8.003 0 010 15.496V199a3 3 0 01-3 3h-74a3 3 0 01-3-3v-27.2a11 11 0 006-9.8 11 11 0 00-6-9.8z"
          />
          <path
            fill="#FFF"
            d="M224.758 146.302c8.86 0 16.087 7.157 16.24 16.015.156 9.12-7.44 16.583-16.528 16.583h-1.41a1.02 1.02 0 01-1.018-1.02v-2.341c0-.563.457-1.019 1.017-1.019h1.463c6.644 0 12.224-5.457 12.111-12.126-.11-6.478-5.395-11.712-11.875-11.712h-5.61l2.473 2.484a1.07 1.07 0 010 1.517l-1.356 1.362c-.207.21-.482.313-.756.313-.275 0-.55-.103-.756-.313l-6.768-6.794a1.066 1.066 0 01-.313-.759c0-.286.11-.555.313-.758l6.768-6.794a1.065 1.065 0 011.512 0l1.356 1.361c.419.418.419 1.1 0 1.518l-2.472 2.483h5.609zm-8.72 28.447c.203.203.313.471.313.758 0 .287-.11.558-.312.759l-6.768 6.796a1.072 1.072 0 01-1.515 0l-1.354-1.362a1.08 1.08 0 010-1.52l2.473-2.483h-5.61c-8.86 0-16.087-7.157-16.24-16.014-.155-9.12 7.44-16.582 16.528-16.582h1.411c.563 0 1.017.456 1.017 1.019v2.34a1.02 1.02 0 01-1.017 1.021h-1.462c-6.645 0-12.225 5.458-12.112 12.125.11 6.477 5.395 11.711 11.875 11.711h5.61l-2.473-2.481a1.066 1.066 0 01-.313-.759c0-.289.11-.558.313-.76l1.357-1.362a1.065 1.065 0 011.512 0l6.768 6.794z"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg width={54} height={54} viewBox="0 0 24 24">
      <g fill="#FFF">
        <path d="M22.112 16.613c.437 1.264 1.059 2.189 1.865 2.778l-.549 1.424c-.789-.321-1.516-.905-2.182-1.754-.666-.85-1.179-1.862-1.539-3.04-.361-1.177-.546-2.43-.557-3.755v-.386c0-1.394.185-2.692.557-3.892.371-1.201.884-2.218 1.539-3.053.654-.835 1.382-1.418 2.182-1.75l.549 1.424c-.801.589-1.419 1.508-1.857 2.757-.437 1.249-.658 2.713-.664 4.394v.377c0 1.72.219 3.213.656 4.476zM5.308 21.457C2.38 21.457 0 19.076 0 16.149V7.154c0-2.926 2.38-5.307 5.308-5.307h7.462c2.927 0 5.308 2.381 5.308 5.307v8.995c0 2.927-2.381 5.308-5.308 5.308h-1.005c-.252 0-.457-.204-.457-.456v-1.048c0-.253.205-.457.457-.457l1.005.001c1.846 0 3.348-1.502 3.348-3.348V7.154c0-1.845-1.502-3.347-3.348-3.347H5.308c-1.846 0-3.348 1.502-3.348 3.347v8.995c0 1.846 1.502 3.348 3.348 3.348l1.002-.001-1.112-1.112c-.091-.091-.14-.212-.14-.34 0-.129.05-.249.14-.34l.61-.61c.094-.094.217-.14.34-.14.123 0 .246.046.34.14l3.04 3.043c.092.09.142.211.142.34 0 .128-.05.249-.141.339v.001l-3.041 3.042c-.188.188-.493.188-.68 0l-.61-.61c-.187-.187-.187-.492 0-.68l1.11-1.112h-1z" />
        <text fontFamily="Roboto" fontSize="11.25" fontWeight="700">
          <tspan x="5.835" y="15">
            {repeat}
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default LoopIcon;