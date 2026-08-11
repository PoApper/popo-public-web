import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { Activity, ActivityReport } from '@/components/extracurricular/types';

const ExtracurricularDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('전체');
  const [selectedMajor, setSelectedMajor] = useState<string>('전체');
  const [selectedGrade, setSelectedGrade] = useState<string>('전체');
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
          {loadError
            ? '비교과활동을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
            : '로딩 중...'}
        </LoadingContainer>
      </Layout>
    );
  }

  // Filter options
  const periods = [
    '전체',
    ...Array.from(new Set(reports.map((r) => r.period))),
  ];
  const majors = ['전체', ...Array.from(new Set(reports.map((r) => r.major)))];
  const grades = ['전체', ...Array.from(new Set(reports.map((r) => r.grade)))];

  const filteredReports = reports.filter((rep) => {
    const matchPeriod =
      selectedPeriod === '전체' || rep.period === selectedPeriod;
    const matchMajor = selectedMajor === '전체' || rep.major === selectedMajor;
    const matchGrade = selectedGrade === '전체' || rep.grade === selectedGrade;
    return matchPeriod && matchMajor && matchGrade;
  });

  return (
    <Layout>
      <Container>
        <Breadcrumb>
          <Link href="/extracurricular">← 전체 비교과활동 목록</Link>
        </Breadcrumb>

        <OverviewCard>
          <OverviewHeader>
            <CategoryBadge>{activity.category}</CategoryBadge>
            <h1>{activity.title}</h1>
          </OverviewHeader>

          <Description>{activity.description}</Description>

          <InfoGrid>
            <InfoBox>
              <InfoLabel>모집 / 시행 시기</InfoLabel>
              <InfoValue>{activity.period}</InfoValue>
            </InfoBox>
            <InfoBox>
              <InfoLabel>지원 대상</InfoLabel>
              <InfoValue>{activity.target}</InfoValue>
            </InfoBox>
            <InfoBox style={{ gridColumn: '1 / -1' }}>
              <InfoLabel>신청 및 선발 절차</InfoLabel>
              <InfoValue>{activity.applicationMethod}</InfoValue>
            </InfoBox>
          </InfoGrid>
        </OverviewCard>

        <SectionTitleWrapper>
          <SectionTitle>활동 보고서</SectionTitle>
          <CountTag>{filteredReports.length}건</CountTag>
        </SectionTitleWrapper>

        <FilterBar>
          <FilterGroup>
            <FilterLabel>시기:</FilterLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>전공:</FilterLabel>
            <Select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>학년:</FilterLabel>
            <Select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>보고서 / 수기 제목</th>
                <th>수행 시기</th>
                <th>학년</th>
                <th>전공</th>
                <th>작성자</th>
                <th>파일 유형</th>
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
                    <ReportTitle>{rep.title}</ReportTitle>
                    <AiSummarySnippet>
                      {rep.aiSummary.slice(0, 70)}...
                    </AiSummarySnippet>
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
            <EmptyReports>조건에 만족하는 보고서가 없습니다.</EmptyReports>
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

const CategoryBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background-color: #eff6ff;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 8px;
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
  font-weight: 600;
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
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CountTag = styled.span`
  font-size: 13px;
  font-weight: 600;
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
`;

const FilterLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
`;

const Select = styled.select`
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
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;

  th {
    background-color: #f9fafb;
    color: #4b5563;
    font-weight: 600;
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

const ReportTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;

  &:hover {
    color: #2563eb;
  }
`;

const AiSummarySnippet = styled.div`
  font-size: 12px;
  color: #6b7280;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileTypeBadge = styled.span<{ type: string }>`
  font-size: 11px;
  font-weight: 700;
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
