import { useTranslation } from 'next-i18next/pages';
import { GetServerSideProps } from 'next';
import { getI18nProps } from '@/lib/i18n';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { Activity, ActivityReport } from '@/components/extracurricular/types';

const ALL = '__all__';

const ExtracurricularDetailPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ALL);
  const [selectedMajor, setSelectedMajor] = useState<string>(ALL);
  const [selectedGrade, setSelectedGrade] = useState<string>(ALL);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [actRes, repRes] = await Promise.all([
          PoPoAxios.get<Activity>(`/activity/${id}`),
          PoPoAxios.get<ActivityReport[]>('/activity-report', {
            params: { activityId: id },
          }),
        ]);
        setActivity(actRes.data ?? null);
        setReports(Array.isArray(repRes.data) ? repRes.data : []);
      } catch (err) {
        console.error('비교과활동 상세를 불러오지 못했습니다:', err);
        setLoadError(true);
      }
    };

    fetchData();
  }, [id]);

  if (!activity) {
    return (
      <Layout>
        <LoadingContainer>
          {loadError ? t('extracurricular.loadError') : t('common.loading')}
        </LoadingContainer>
      </Layout>
    );
  }

  // Filter options
  const periods = [ALL, ...Array.from(new Set(reports.map((r) => r.period)))];
  const majors = [ALL, ...Array.from(new Set(reports.map((r) => r.major)))];
  const grades = [ALL, ...Array.from(new Set(reports.map((r) => r.grade)))];

  const filteredReports = reports.filter((rep) => {
    const matchPeriod = selectedPeriod === ALL || rep.period === selectedPeriod;
    const matchMajor = selectedMajor === ALL || rep.major === selectedMajor;
    const matchGrade = selectedGrade === ALL || rep.grade === selectedGrade;
    return matchPeriod && matchMajor && matchGrade;
  });

  return (
    <Layout>
      <Container>
        <Breadcrumb>
          <Link href="/extracurricular">{t('extracurricular.backToList')}</Link>
        </Breadcrumb>

        <OverviewCard>
          <OverviewHeader>
            <h1>{activity.title}</h1>
          </OverviewHeader>

          <Description>{activity.description}</Description>

          <InfoGrid>
            <InfoBox>
              <InfoLabel>{t('extracurricular.period')}</InfoLabel>
              <InfoValue>{activity.period}</InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoLabel>{t('extracurricular.target')}</InfoLabel>
              <InfoValue>{activity.target}</InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoLabel>{t('extracurricular.applicationMethod')}</InfoLabel>
              <InfoValue>{activity.applicationMethod}</InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoLabel>{t('extracurricular.category')}</InfoLabel>
              <InfoValue>{activity.category}</InfoValue>
            </InfoBox>
          </InfoGrid>
        </OverviewCard>

        <SectionTitleWrapper>
          <SectionTitle>{t('extracurricular.reports')}</SectionTitle>
          <CountTag>
            {t('extracurricular.reportCount', {
              count: filteredReports.length,
            })}
          </CountTag>
        </SectionTitleWrapper>

        <FilterBar>
          <FilterGroup>
            <FilterLabel>{t('extracurricular.filterPeriod')}</FilterLabel>
            <Select
              aria-label={t('extracurricular.filterPeriod')}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p === ALL ? t('common.all') : p}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('extracurricular.filterMajor')}</FilterLabel>
            <Select
              aria-label={t('extracurricular.filterMajor')}
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m === ALL ? t('common.all') : m}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('extracurricular.filterGrade')}</FilterLabel>
            <Select
              aria-label={t('extracurricular.filterGrade')}
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g === ALL ? t('common.all') : g}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>{t('extracurricular.reportTitle')}</th>
                <th>{t('extracurricular.periodColumn')}</th>
                <th>{t('extracurricular.grade')}</th>
                <th>{t('extracurricular.major')}</th>
                <th>{t('extracurricular.author')}</th>
                <th>{t('extracurricular.fileType')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((rep) => (
                <tr
                  key={rep.uuid}
                  onClick={() =>
                    router.push(`/extracurricular/report/${rep.uuid}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <TitleTd>
                    <ReportTitle
                      href={`/extracurricular/report/${rep.uuid}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {rep.title}
                    </ReportTitle>
                  </TitleTd>
                  <td>{rep.period}</td>
                  <td>{rep.grade}</td>
                  <td>{rep.major}</td>
                  <td>{rep.author}</td>
                  <td>
                    <FileTypeBadge type={rep.fileType}>
                      {rep.fileType.toUpperCase()}
                    </FileTypeBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredReports.length === 0 && (
            <EmptyReports>{t('extracurricular.reportsEmpty')}</EmptyReports>
          )}
        </TableWrapper>
      </Container>
    </Layout>
  );
};

export default ExtracurricularDetailPage;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 100px 0;
  font-size: 16px;
  color: #6b7280;
`;

const Breadcrumb = styled.div`
  margin-bottom: 20px;

  a {
    color: #2563eb;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const OverviewCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
`;

const OverviewHeader = styled.div`
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 20px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoBox = styled.div``;

const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  margin-bottom: 4px;

  text-transform: uppercase;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.5;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const CountTag = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 2px 8px;
  border-radius: 9999px;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
`;

const FilterLabel = styled.span`
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
`;

const Select = styled.select`
  min-width: 0;
  max-width: 100%;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  background-color: #fff;

  &:focus {
    border-color: #2563eb;
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;

  th {
    background-color: #f9fafb;
    color: #4b5563;
    font-weight: 500;
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
  }

  tbody tr {
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f9fafb;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

const TitleTd = styled.td`
  max-width: 400px;
`;

const ReportTitle = styled(Link)`
  display: block;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  text-decoration: none;

  &:hover {
    color: #2563eb;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 4px;
    border-radius: 2px;
  }
`;

const FileTypeBadge = styled.span<{ type: string }>`
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: #ffffff;
  background-color: ${(props) =>
    props.type === 'pdf'
      ? '#ef4444'
      : props.type === 'docx'
        ? '#2563eb'
        : '#10b981'};
`;

const EmptyReports = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 14px;
`;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
