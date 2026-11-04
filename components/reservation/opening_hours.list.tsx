import { useTranslation } from 'next-i18next/pages';

const OpeningHoursList = ({ openingHours }: { openingHours: any }) => {
  const { t } = useTranslation('common');

  let isBriefCase: boolean;
  if (openingHours['Everyday']) {
    isBriefCase = false;
  } else {
    let cnt = 0;
    for (const day of Object.keys(openingHours)) {
      if (openingHours[day] === '00:00-24:00') {
        cnt += 1;
      }
    }
    isBriefCase = cnt > 5;
  }

  return (
    <div style={{ width: '100%' }}>
      {Object.keys(openingHours).map((day) => {
        if (isBriefCase && openingHours[day] === '00:00-24:00') {
          return;
        }

        return (
          <div key={day} style={{ display: 'flex', margin: 0 }}>
            <div style={{ flex: 2, margin: 0 }}>
              {t(`openingHours.${day}`)}:
            </div>
            <div style={{ flex: 4, margin: 0 }}>{openingHours[day]}</div>
          </div>
        );
      })}
      {isBriefCase ? (
        <div key={'others'} style={{ display: 'flex', margin: 0 }}>
          <div style={{ flex: 2, margin: 0 }}>{t('openingHours.others')}</div>
          <div style={{ flex: 4, margin: 0 }}>00:00-24:00</div>
        </div>
      ) : null}
    </div>
  );
};

export default OpeningHoursList;
