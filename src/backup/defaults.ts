import { p9e } from '../utils.js';

const defaults = {
  location: p9e`./.backups/%Y/%m/%d`,
  filename: 'backup_@%H-%M-%S',
  compression: 'zip',
};

export default defaults;
