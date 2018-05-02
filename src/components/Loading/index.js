import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import Icon from '../Icon';
import { TopTitle } from '../typography';

const Loading = ({ color, loading, title }) => {
  return loading ? (
    <Loader color={color} />
  ) : title ? (
    <TopTitle>{title}</TopTitle>
  ) : (
    <Icon color={color} icon="voicemail" size={28} />
  );
};

Loading.propTypes = {
  color: PropTypes.string,
  loading: PropTypes.bool,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  loading: state.auth.pending || state.files.pending || state.playlists.pending
});

export default connect(mapStateToProps)(Loading);
