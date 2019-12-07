import React from "react";
//import 

const SvgRobotBlink = props => (
  <svg
    id="robotBlink_svg__Layer_1"
    x={0}
    y={0}
    viewBox="0 0 2000 2000"
    xmlSpace="preserve"
    width="1em"
    height="1em"
    {...props}
  >
    <style>
      {
        "@-webkit-keyframes blink{0%,40%,60%,to{-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:50% 45%;transform-origin:50% 45%}50%{-webkit-transform:scaleY(.1);transform:scaleY(.1);-webkit-transform-origin:50% 45%;transform-origin:50% 45%}}@keyframes blink{0%,40%,60%,to{-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transform-origin:50% 45%;transform-origin:50% 45%}50%{-webkit-transform:scaleY(.1);transform:scaleY(.1);-webkit-transform-origin:50% 45%;transform-origin:50% 45%}}@-webkit-keyframes move1{0%,to{-webkit-transform:rotate(0deg) translateY(1%);transform:rotate(0deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}50%{-webkit-transform:rotate(5deg) translateY(1%);transform:rotate(5deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}}@keyframes move1{0%,to{-webkit-transform:rotate(0deg) translateY(1%);transform:rotate(0deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}50%{-webkit-transform:rotate(5deg) translateY(1%);transform:rotate(5deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}}@-webkit-keyframes move2{0%,to{-webkit-transform:rotate(0deg) translateY(1%);transform:rotate(0deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}50%{-webkit-transform:rotate(-5deg) translateY(1%);transform:rotate(-5deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}}@keyframes move2{0%,to{-webkit-transform:rotate(0deg) translateY(1%);transform:rotate(0deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}50%{-webkit-transform:rotate(-5deg) translateY(1%);transform:rotate(-5deg) translateY(1%);-webkit-transform-origin:50% 30%;transform-origin:50% 30%}}.robotBlink_svg__st0{fill:#597fab}"
      }
    </style>
    <path
      className="robotBlink_svg__st0"
      d="M911.17 682.55l-54.33-97.86c13.97-15.64 17.27-38.99 6.51-58.35-13.58-24.47-44.43-33.29-68.9-19.71-24.47 13.58-33.29 44.43-19.7 68.9 10.75 19.37 32.32 28.92 52.97 25.33l45.31 81.61c13.43.06 25.02.15 38.14.08z"
      style={{
        WebkitAnimation: "move1 1s forwards infinite",
        animation: "move1 1s forwards infinite"
      }}
    />
    <path
      className="robotBlink_svg__st0"
      d="M1114.43 682.55l45.26-81.53c20.66 3.59 42.22-5.96 52.97-25.33 13.58-24.47 4.76-55.31-19.71-68.9-24.47-13.58-55.31-4.76-68.9 19.71-10.75 19.37-7.45 42.72 6.51 58.35l-54.25 97.72c13.07-.15 25.69.04 38.12-.02z"
      style={{
        WebkitAnimation: "move2 .8s forwards infinite .1s",
        animation: "move2 .8s forwards infinite .1s"
      }}
    />
    <path
      id="robotBlink_svg__robotBody"
      className="robotBlink_svg__st0"
      d="M882.71 682.52h-140.4c-40.61 0-73.83 33.22-73.83 73.83v65.93c-36.82 1.16-66.59 31.62-66.59 68.71v63.7c0 37.09 29.77 67.55 66.59 68.71v65.93c0 40.61 33.22 73.83 73.83 73.83h512.49c40.61 0 73.83-33.22 73.83-73.83v-65.17c.24 0 .48.02.72.02 37.82 0 68.77-30.94 68.77-68.77v-63.7c0-37.82-30.94-68.77-68.77-68.77-.24 0-.48.02-.72.02v-66.61c0-40.61-33.22-73.83-73.83-73.83h-140.4m-38.09 0H920.79m326.79 240.31c0 74.05-60.59 134.64-134.64 134.64H884.16c-74.05 0-134.64-60.59-134.64-134.64 0-74.05 60.59-134.64 134.64-134.64h228.78c74.05.01 134.64 60.59 134.64 134.64z"
    />
    <g
      style={{
        WebkitAnimation: "blink 3s forwards infinite",
        animation: "blink 3s forwards infinite"
      }}
    >
      <path
        className="robotBlink_svg__st0"
        d="M922.55 850.45h-43.43c-5.57 0-10.13 4.56-10.13 10.13v88.31c0 5.57 4.56 10.13 10.13 10.13h43.43c5.57 0 10.13-4.56 10.13-10.13v-88.31c0-5.57-4.56-10.13-10.13-10.13z"
      />
    </g>
    <path
      id="robotBlink_svg__leftOko"
      className="robotBlink_svg__st0"
      d="M1117.99 850.45h-43.43c-5.57 0-10.13 4.56-10.13 10.13v88.31c0 5.57 4.56 10.13 10.13 10.13h43.43c5.57 0 10.13-4.56 10.13-10.13v-88.31c0-5.57-4.56-10.13-10.13-10.13z"
    />
  </svg>
);

export default SvgRobotBlink;