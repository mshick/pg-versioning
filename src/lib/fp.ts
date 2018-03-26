import * as lodash from 'lodash';
import convert from 'lodash/fp/convert';

export default convert(lodash.runInContext());
