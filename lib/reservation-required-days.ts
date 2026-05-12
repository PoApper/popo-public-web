import moment from 'moment-timezone';

export function getReservationDaysUntil(
  date: string,
  now: moment.Moment | Date | string = moment().tz('Asia/Seoul'),
) {
  if (!/^\d{8}$/.test(date)) {
    return null;
  }

  const reservationDate = moment.tz(date, 'YYYYMMDD', true, 'Asia/Seoul');
  if (!reservationDate.isValid()) {
    return null;
  }

  const today = moment.isMoment(now)
    ? now.clone().tz('Asia/Seoul')
    : moment(now).tz('Asia/Seoul');

  return reservationDate.startOf('day').diff(today.startOf('day'), 'days');
}

export function isReservationLeadTimeSatisfied(
  date: string,
  reservationRequiredDays?: number,
  now?: moment.Moment | Date | string,
) {
  const requiredDays = Number(reservationRequiredDays) || 0;
  if (requiredDays <= 0) {
    return true;
  }

  const daysUntil = getReservationDaysUntil(date, now);
  return daysUntil !== null && daysUntil >= requiredDays;
}

export function getReservationRequiredDate(reservationRequiredDays?: number) {
  const requiredDays = Math.max(0, Number(reservationRequiredDays) || 0);
  return moment().tz('Asia/Seoul').add(requiredDays, 'days').startOf('day');
}
