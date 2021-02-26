import moment = require('moment');

export function checkDate(value: any) {
  return moment(value, 'YYYY-MM-DD', true).isValid();
}
