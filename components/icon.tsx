"use client"
import { useEffect, useState } from 'react';

const DynamicSVGIcon = ({ color, size }) => {
  const [iconColor, setIconColor] = useState(color);
  const [iconSize, setIconSize] = useState(size);

  // Update the color and size when props change
  useEffect(() => {
    setIconColor(color);
  }, [color]);

  useEffect(() => {
    setIconSize(size);
  }, [size]);

  return (
    <svg
      style={{ color: iconColor, fontSize: iconSize }}
      className="svg-inline--fa fa-award fa-fw"
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="award"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      data-fa-i2svg=""
    >
      <g className="fa-duotone-group">
        <path
          className={`fa-secondary fill-[${iconColor}]/80`}
          fill={iconColor}
          d="M0 448c0-2.1 .4-4.2 1.3-6.2L56.9 309.7l1.8 .9c6.4 3.2 11.5 8.4 14.7 14.7L83 344.5c5.9 11.8 18.3 19 31.5 18.2l21.3-1.3c7.1-.4 14.2 1.5 20.1 5.4l17.8 11.8c3.4 2.3 7.2 3.8 11 4.7l-50.1 119c-2.3 5.5-7.4 9.2-13.3 9.7c-.5 0-1 .1-1.4 .1c-5.4 0-10.4-2.7-13.4-7.3L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6C1.1 455 0 451.5 0 448zm199.2-64.8c1.9-.4 3.8-1 5.7-1.8c.9-.4 1.8-.8 2.7-1.3c.4-.2 .9-.5 1.3-.7s.9-.5 1.3-.8L228 366.8c6-3.9 13-5.8 20.1-5.4l21.3 1.3c13.2 .8 25.6-6.4 31.5-18.2l9.6-19.1c3.2-6.4 8.4-11.5 14.7-14.7l1.8-.9 55.6 132.1c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7l-50.1-119z"
        ></path>
        <path
          className="fa-primary"
          fill={iconColor}
          d="M210.2 5.5c-11-7.3-25.4-7.3-36.4 0L156 17.2c-6 3.9-13 5.8-20.1 5.4l-21.3-1.3c-13.2-.8-25.6 6.4-31.5 18.2L73.4 58.6C70.2 65 65 70.2 58.6 73.4L39.5 83c-11.8 5.9-19 18.3-18.2 31.5l1.3 21.3c.4 7.1-1.5 14.2-5.4 20.1L5.5 173.8c-7.3 11-7.3 25.4 0 36.4L17.2 228c3.9 6 5.8 13 5.4 20.1l-1.3 21.3c-.8 13.2 6.4 25.6 18.2 31.5l19.1 9.6c6.4 3.2 11.5 8.4 14.7 14.7L83 344.5c5.9 11.8 18.3 19 31.5 18.2l21.3-1.3c7.1-.4 14.2 1.5 20.1 5.4l17.8 11.8c11 7.3 25.4 7.3 36.4 0L228 366.8c6-3.9 13-5.8 20.1-5.4l21.3 1.3c13.2 .8 25.6-6.4 31.5-18.2l9.6-19.1c3.2-6.4 8.4-11.5 14.7-14.7l19.1-9.6c11.8-5.9 19-18.3 18.2-31.5l-1.3-21.3c-.4-7.1 1.5-14.2 5.4-20.1l11.8-17.8c7.3-11 7.3-25.4 0-36.4L366.8 156c-3.9-6-5.8-13-5.4-20.1l1.3-21.3c.8-13.2-6.4-25.6-18.2-31.5l-19.1-9.6c-6.4-3.2-11.5-8.4-14.7-14.7L301 39.5c-5.9-11.8-18.3-19-31.5-18.2l-21.3 1.3c-7.1 .4-14.2-1.5-20.1-5.4L210.2 5.5zM192 112a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
        ></path>
      </g>
    </svg>
  );
};

export default DynamicSVGIcon;
