import React from 'react';
import PropTypes from 'prop-types';
import { Svg } from 'expo';

const File = ({ color = '', size = 24 }) => {
  return (
    <Svg height={size} viewBox="0 -256 1792 1792" width={size}>
      <Svg.Path
        d="M1266.983 933.424v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23zm0-256v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23zm-896 608h1024v-768h-416q-40 0-68-28t-28-68v-416h-512v1280zm640-896h299l-299-299v299zm512 128v800q0 40-28 68t-68 28h-1088q-40 0-68-28t-28-68v-1344q0-40 28-68t68-28h544q40 0 88 20t76 48l408 408q28 28 48 76t20 88z"
        fill={color}
      />
    </Svg>
  );
};

File.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

export default File;
