import moment from 'moment';

// dt: YYYMMDD
export function convertDate(dt: string) {
  return moment(dt, 'YYYYMMDD').format('YYYY년 MM월 DD일');
}

// time: HHmm
export function convertTime(time: string) {
  return moment(time, 'HHmm').format('HH:mm');
}

export function hourDiff(
  startTime: string | moment.Moment,
  endTime: string | moment.Moment,
): number {
  // 시작 시각은 그대로 두고 종료 시각을 변경할 때 시간이 이상하게 표시되는 문제 수정
  // 관련 이슈: https://github.com/PoApper/popo-public-web/issues/148
  let startMoment: moment.Moment;
  let endMoment: moment.Moment;

  if (typeof startTime === 'string') {
    startMoment = moment(startTime, 'HHmm');
  } else {
    // moment 객체인 경우 시간만 추출하여 새로운 moment 객체 생성 (날짜 정보 제거)
    startMoment = moment().hour(startTime.hour()).minute(startTime.minute()).second(0).millisecond(0);
  }

  if (typeof endTime === 'string') {
    endMoment = moment(endTime, 'HHmm');
  } else {
    // moment 객체인 경우 시간만 추출하여 새로운 moment 객체 생성 (날짜 정보 제거)
    endMoment = moment().hour(endTime.hour()).minute(endTime.minute()).second(0).millisecond(0);
  }

  const duration = moment.duration(endMoment.diff(startMoment));
  
  // 부동소수점 정밀도 문제 해결을 위해 반올림
  return Math.round(duration.asHours() * 100) / 100;
}

export function minuteDiff(
  startTime: string | moment.Moment,
  endTime: string | moment.Moment,
): number {
  let startMoment: moment.Moment;
  let endMoment: moment.Moment;

  if (typeof startTime === 'string') {
    startMoment = moment(startTime, 'HHmm');
  } else {
    // moment 객체인 경우 시간만 추출하여 새로운 moment 객체 생성 (날짜 정보 제거)
    startMoment = moment().hour(startTime.hour()).minute(startTime.minute()).second(0).millisecond(0);
  }

  if (typeof endTime === 'string') {
    endMoment = moment(endTime, 'HHmm');
  } else {
    // moment 객체인 경우 시간만 추출하여 새로운 moment 객체 생성 (날짜 정보 제거)
    endMoment = moment().hour(endTime.hour()).minute(endTime.minute()).second(0).millisecond(0);
  }

  const duration = moment.duration(endMoment.diff(startMoment));
  
  // 부동소수점 정밀도 문제 해결을 위해 반올림
  return Math.round(duration.asMinutes());
}

export function roundUpByDuration(
  date: moment.Moment,
  durationMinutes: number = 30,
): moment.Moment {
  if (durationMinutes < 60) {
    const remainder = durationMinutes - (date.minute() % durationMinutes);
    return moment(date).add(remainder, 'minutes').second(0);
  } else {
    const quotient = (date.minute() % durationMinutes) + 1;
    const newHour = Math.floor((quotient * durationMinutes) / 60);
    const newMinute = (quotient * durationMinutes) % 60;
    return moment(date).hour(newHour).minute(newMinute).second(0);
  }
}

export function convertStatus(status: string) {
  switch (status) {
    case '통과':
      return 'green';
    case '거절':
      return 'red';
    default:
      return 'black';
  }
}
