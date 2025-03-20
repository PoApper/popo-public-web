export const KoreanWeekday: any = {
  Monday: '월',
  Tuesday: '화',
  Wednesday: '수',
  Thursday: '목',
  Friday: '금',
  Saturday: '토',
  Sunday: '일',
  Everyday: '매일',
};

export const KoreanToEnglishMap: any = {
  월요일: 'Monday',
  화요일: 'Tuesday',
  수요일: 'Wednesday',
  목요일: 'Thursday',
  금요일: 'Friday',
  토요일: 'Saturday',
  일요일: 'Sunday',
};

export function isOnOpeningHours(
  opening_hours: string,
  weekday: string, // Monday
  start_time: string, // hh:mm
  end_time: string, // hh:mm
) {
  const openingHour = JSON.parse(opening_hours);

  if (openingHour['Everyday']) {
    weekday = 'Everyday';
  }

  if (KoreanToEnglishMap[weekday]) {
    weekday = KoreanToEnglishMap[weekday];
  }
  const hours = openingHour[weekday].split(',');

  for (const hour of hours) {
    // 다음과 같이 &가 있어 시간이 나눠지는 상황도 고려해야 함 "Sunday":"00:00-10:00 & 13:00-24:00"
    const openTimesPerDay = hour.split(' & ');
    for (const openTime of openTimesPerDay) {
      const open_start = openTime.split('-')[0];
      const open_end = openTime.split('-')[1];

      // 하나라도 range 내부에 포함된다면 예약 가능
      const isInside = open_start <= start_time && end_time <= open_end;
      if (isInside) {
        return true;
      }
    }
  }

  return false;
}
