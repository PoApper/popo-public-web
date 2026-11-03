import moment from 'moment';
import React from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'next-i18next/pages';
import styled from 'styled-components';

const ReservationCalendar = ({
  markedDates,
  selectedDate,
  setSelectedDate,
}) => {
  const { i18n } = useTranslation('common');
  return (
    <StyledCalendar
      locale={i18n.language === 'en' ? 'en-US' : 'ko-KR'}
      formatDay={(_, date) => moment(date).format('DD')}
      onChange={(value) => setSelectedDate(moment(value).format('YYYYMMDD'))}
      defaultValue={moment(selectedDate).toDate()}
      view={'month'}
      prev2Label={null}
      next2Label={null}
      minDate={moment().subtract(1, 'month').startOf('month').toDate()}
      maxDate={moment().add(30, 'day').toDate()}
      tileContent={({ date }) => {
        let color = null;
        let crowded = null;
        if (
          markedDates.find(
            (x) =>
              moment(x).format('YYYY-MM-DD') ===
              moment(date).format('YYYY-MM-DD'),
          )
        ) {
          color = '#f2711c';
        }
        crowded = markedDates.filter(
          (x) =>
            moment(x).format('YYYY-MM-DD') ===
            moment(date).format('YYYY-MM-DD'),
        ).length;
        if (crowded >= 3) {
          return (
            <CellDots>
              {[0, 1, 2].map((index) => (
                <CellDot
                  key={index}
                  color={color}
                  margin={`2px ${index === 2 ? 'auto' : '0'} 0 ${
                    index === 0 ? 'auto' : '0'
                  }`}
                />
              ))}
            </CellDots>
          );
        } else if (crowded >= 2) {
          return (
            <CellDots>
              {[0, 1].map((index) => (
                <CellDot
                  key={index}
                  color={color}
                  margin={`2px ${index === 1 ? 'auto' : '0'} 0 ${
                    index === 0 ? 'auto' : '0'
                  }`}
                />
              ))}
            </CellDots>
          );
        } else {
          return (
            <CellDots>
              <CellDot color={color} margin={'2px auto'} />
            </CellDots>
          );
        }
      }}
    />
  );
};

export default ReservationCalendar;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: 1px solid rgba(34, 36, 38, 0.15);
  font-size: 1.2rem;
`;

const CellDot = styled.div`
  height: 8px;
  width: 8px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin: ${(props) => props.margin};
`;

const CellDots = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
