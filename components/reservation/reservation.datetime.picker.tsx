import moment from 'moment-timezone';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roundUpByDuration } from '@/lib/time-date';
const ReservationDatetimePicker = ({
  date,
  startTime,
  endTime,
  setDate,
  setStartTime,
  setEndTime,
  timeIntervals,
  isCinemaRoom,
}: {
  date: any;
  startTime: any;
  endTime: any;
  setDate: any;
  setStartTime: any;
  setEndTime: any;
  timeIntervals?: number;
  isCinemaRoom?: boolean;
}) => {
  const now: moment.Moment = roundUpByDuration(moment().tz('Asia/Seoul'), 30);
  const nowNext30Min: moment.Moment = moment(now).add(30, 'minute');

  const CinemaExcludeTimes = [
    moment(date.format('YYYY-MM-DD') + 'T03:00').toDate(),
    moment(date.format('YYYY-MM-DD') + 'T06:00').toDate(),
    moment(date.format('YYYY-MM-DD') + 'T09:00').toDate(),
    moment(date.format('YYYY-MM-DD') + 'T12:00').toDate(),
    moment(date.format('YYYY-MM-DD') + 'T15:00').toDate(),
  ];

  return (
    <>
      <div className={'required field'}>
        <label>날짜</label>
        <DatePicker
          onKeyDown={(e) => e.preventDefault()}
          dateFormat={'yyyy-MM-dd'}
          minDate={now.toDate()}
          maxDate={now.add(30, 'day').toDate()}
          selected={date.toDate()}
          onChange={(date: Date | null) => {
            if (date) {
              const targetDate: string = moment(date).format('YYYY-MM-DD');
              const nowDate: string = now.format('YYYY-MM-DD');
              if (targetDate === nowDate) {
                setDate(now);
                setStartTime(now);
                setEndTime(nowNext30Min);
              } else {
                setDate(moment(targetDate + 'T00:00'));
                setStartTime(moment(targetDate + 'T00:00'));
                if (isCinemaRoom) {
                  setEndTime(moment(targetDate + 'T03:00'));
                } else {
                  setEndTime(moment(targetDate + 'T00:30'));
                }
              }
            }
          }}
        />
      </div>

      <div className={'required field'}>
        <label>시작 시간</label>
        <DatePicker
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={timeIntervals ?? 30}
          onKeyDown={(e) => e.preventDefault()}
          dateFormat={'hh:mm aa'}
          selected={startTime.toDate()}
          excludeTimes={isCinemaRoom ? CinemaExcludeTimes : []}
          minTime={isCinemaRoom ? date.toDate() : date.toDate()}
          maxTime={
            isCinemaRoom
              ? moment(date.format('YYYY-MM-DD') + 'T21:00').toDate()
              : moment(date.format('YYYY-MM-DD') + 'T23:59').toDate()
          }
          onChange={(startTime: Date | null) => {
            const newStartTime = moment(startTime);
            const newStartTimeNext30Min = moment(newStartTime).add(
              timeIntervals ?? 30,
              'minute',
            );
            setStartTime(newStartTime);
            setEndTime(newStartTimeNext30Min);
          }}
        />
      </div>

      <div className={'required field'}>
        <label>종료 시간</label>
        <DatePicker
          showTimeSelect
          showTimeSelectOnly
          disabled={isCinemaRoom}
          timeIntervals={timeIntervals ?? 30}
          onKeyDown={(e) => e.preventDefault()}
          dateFormat={'hh:mm aa'}
          selected={endTime.toDate()}
          minTime={
            isCinemaRoom
              ? moment(date.format('YYYY-MM-DD') + 'T12:00').toDate()
              : moment(startTime).add(30, 'minute').toDate()
          }
          maxTime={
            isCinemaRoom
              ? moment(date.format('YYYY-MM-DD') + 'T15:00').toDate()
              : endTime.format('HHmm') === '0000'
                ? moment(date.format('YYYY-MM-DD') + 'T00:00').toDate() // edge-case
                : moment(date.format('YYYY-MM-DD') + 'T23:59').toDate()
          }
          onChange={(endTime: Date | null) => {
            if (isCinemaRoom) {
              return;
            } else {
              setEndTime(moment(endTime));
            }
          }}
        />
      </div>
    </>
  );
};

export default ReservationDatetimePicker;
