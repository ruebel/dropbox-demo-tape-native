import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import Icon from '../Icon';

const Loading = ({ color, loading }) => {
  return loading ? (
    <Loader color={color} />
  ) : (
    <Icon color={color} icon="voicemail" size={28} />
  );
};

Loading.propTypes = {
  color: PropTypes.string,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  loading: state.auth.pending || state.files.pending || state.playlists.pending
});

export default connect(mapStateToProps)(Loading);
