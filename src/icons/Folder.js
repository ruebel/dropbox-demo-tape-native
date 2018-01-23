import React from 'react';
import PropTypes from 'prop-types';
import { Svg } from 'expo';

const Folder = ({ color = '', size = 24 }) => {
  return (
    <Svg
      fill="none"
      height={size}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width={size}
    >
      <Svg.Path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        stroke={color}
      />
    </Svg>
  );
};

Folder.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

export default Folder;
