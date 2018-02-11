import { arrayOf, number, shape, string } from 'prop-types';

export const trackType = shape({
  id: string.isRequired,
  path: string.isRequired
});

export const trackList = arrayOf(trackType);

export const playlistType = shape({
  data: shape({
    title: string,
    tracks: trackList
  }),
  meta: shape({
    /* eslint-disable camelcase */
    '.tag': string,
    client_modified: string,
    content_hash: string,
    id: string,
    name: string,
    path_display: string,
    path_lower: string,
    rev: string,
    server_modified: string,
    size: number
    /* eslint-enable camelcase */
  })
});

export const playlistsType = arrayOf(playlistType);

export const userType = shape({
  id: string,
  token: string,
  uid: string
});
