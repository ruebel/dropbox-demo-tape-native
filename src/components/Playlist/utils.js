export const getFileName = path =>
  removeExtension(path.substring(path.lastIndexOf('/') + 1));

export const getFilePath = path => path.substring(0, path.lastIndexOf('/'));

const removeExtension = fileName =>
  fileName.substring(0, fileName.lastIndexOf('.'));
