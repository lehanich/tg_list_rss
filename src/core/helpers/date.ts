
export function dateFormat2(date: Date): string { // 2024-01-23T00:00:00Z
  return date.getFullYear()+'-'+
  ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
  ('00' + date.getDate()).slice(-2) + 'T00:00:00Z';
}

export function dateFormat3(date: Date): string { // 23.01.2024
  return ('00' + date.getDate()).slice(-2) + '.' +
  ('00' + (date.getMonth() + 1)).slice(-2) + '.' +
  date.getFullYear();
}

export function dateFormat(date: Date): string { //23.01.2024 00:00:00
  return ('00' + date.getDate()).slice(-2) + '.' +
  ('00' + (date.getMonth() + 1)).slice(-2) + '.' +
  date.getFullYear() + ' ' +
  ('00' + date.getHours()).slice(-2) + ':' +
  ('00' + date.getMinutes()).slice(-2) + ':' +
  ('00' + date.getSeconds()).slice(-2);
}

export function dateLength(date1: Date, date2: Date): number { // seconds
  return (date2.valueOf() - date1.valueOf() );
}

export function subDays(day2: any, day1: any, mode: 'day' | 'hour' | 'minute' | 'mounth' | 'year'): number {
  let k = 1;
  switch (mode) {
  case 'day':
    k = 1000 * 60 * 60 * 24;
    break;
  case 'hour':
    k = 1000 * 60 * 60;
    break;
  case 'minute':
    k = 1000 * 60;
    break;
  case 'mounth':
    1000 * 60 * 60 * 24 * 30;
    break;
  case 'year':
    1000 * 60 * 60 * 24 * 365;
    break;
  default:
    k = 1;
  }

  return Math.floor(Math.abs(day2 - day1) / k);
}