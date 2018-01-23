import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';

const Loading = ({ loading }) => {
  return loading ? <Loader /> : null;
};

Loading.propTypes = {
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  loading: state.auth.pending || state.files.pending || state.playlists.pending
});

export default connect(mapStateToProps)(Loading);
