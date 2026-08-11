import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { ActivityReport, Activity } from '@/components/extracurricular/types';

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const { reportId } = router.query;

  const [report, setReport] = useState<ActivityReport | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activePage, setActivePage] = useState<number>(0);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!reportId) return;

    const fetchData = async () => {
      try {
        const repRes = await PoPoAxios.get<ActivityReport>(
          `/activity-report/${reportId}`,
        );
        setReport(repRes.data ?? null);

        if (repRes.data?.activityId) {
          const actRes = await PoPoAxios.get<Activity>(
            `/activity/${repRes.data.activityId}`,
          );
          setActivity(actRes.data ?? null);
        }
      } catch (err) {
        console.error('활동 수기를 불러오지 못했습니다:', err);
        setLoadError(true);
      }
    };

    fetchData();
  }, [reportId]);

  if (!report) {
    return (
      <Layout>
        <LoadingContainer>
          {loadError
            ? '활동 수기를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
            : '보고서 로딩 중...'}
        </LoadingContainer>
      </Layout>
    );
  }

  const handleDownload = () => {
    alert(`[파일 다운로드 실행]: ${report.fileName}`);
  };

  return (
    <Layout>
      <Container>
        <Breadcrumb>
          {activity ? (
            <Link href={`/extracurricular/${activity.uuid}`}>
              ← {activity.title} 상세 목록으로 돌아가기
            </Link>
          ) : (
            <Link href="/extracurricular">← 전체 목록으로 돌아가기</Link>
          )}
        </Breadcrumb>

        <HeaderCard>
          <MetaRow>
            <MetaTag>{report.period}</MetaTag>
            <MetaTag>{report.major}</MetaTag>
            <MetaTag>{report.grade}</MetaTag>
            <MetaTag>작성자: {report.author}</MetaTag>
          </MetaRow>

          <ReportTitle>{report.title}</ReportTitle>

          <DownloadBar>
            <FileBox>
              <FileIcon type={report.fileType}>
                {report.fileType.toUpperCase()}
              </FileIcon>
              <FileName>{report.fileName}</FileName>
            </FileBox>
            <DownloadButton onClick={handleDownload}>
              📥 원본 파일 다운로드
            </DownloadButton>
          </DownloadBar>
        </HeaderCard>

        {report.wordsToJuniors && (
          <SectionCard borderLeft="#3b82f6">
            <SectionHeader>
              <SectionIcon>💡</SectionIcon>
              <SectionTitle>후배에게 한마디 (지원 & 활동 노하우)</SectionTitle>
            </SectionHeader>
            <WordsContent>{report.wordsToJuniors}</WordsContent>
          </SectionCard>
        )}

        {report.aiSummary && (
          <SectionCard borderLeft="#10b981">
            <SectionHeader>
              <SectionIcon>🤖</SectionIcon>
              <SectionTitle>AI 보고서 요약 (핵심 요약)</SectionTitle>
            </SectionHeader>
            <SummaryContent>{report.aiSummary}</SummaryContent>
          </SectionCard>
        )}

        <ViewerSection>
          <ViewerHeader>
            <ViewerTitle>📄 보고서 문서 미리보기</ViewerTitle>
            {report.pages && report.pages.length > 0 && (
              <PageNav>
                {report.pages.map((_, idx) => (
                  <PageButton
                    key={idx}
                    active={activePage === idx}
                    onClick={() => setActivePage(idx)}
                  >
                    {idx + 1} 페이지
                  </PageButton>
                ))}
              </PageNav>
            )}
          </ViewerHeader>

          <ViewerBody>
            {report.pages && report.pages.length > 0 ? (
              <DocumentPage>
                <PageHeader>
                  PAGE {activePage + 1} / {report.pages.length}
                </PageHeader>
                <PageText>{report.pages[activePage]}</PageText>
              </DocumentPage>
            ) : (
              <DocumentPlaceholder>
                <p>본 문서의 미리보기 페이지가 준비되어 있습니다.</p>
                <button onClick={handleDownload}>
                  원문 파일 다운로드하여 열기
                </button>
              </DocumentPlaceholder>
            )}
          </ViewerBody>
        </ViewerSection>
      </Container>
    </Layout>
  );
};

export default ReportDetailPage;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 100px 0;
  color: #6b7280;
  font-size: 16px;
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

const HeaderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const MetaTag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
`;

const ReportTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1.4;
  margin: 0 0 24px 0;
`;

const DownloadBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileIcon = styled.span<{ type: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  color: #ffffff;
  background-color: ${(props) =>
    props.type === 'pdf'
      ? '#ef4444'
      : props.type === 'docx'
        ? '#2563eb'
        : '#10b981'};
`;

const FileName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  word-break: break-all;
`;

const DownloadButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const SectionCard = styled.div<{ borderLeft: string }>`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid ${(props) => props.borderLeft};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const SectionIcon = styled.span`
  font-size: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const WordsContent = styled.p`
  font-size: 15px;
  color: #1f2937;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const SummaryContent = styled.p`
  font-size: 14px;
  color: #374151;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const ViewerSection = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const ViewerHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ViewerTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const PageNav = styled.div`
  display: flex;
  gap: 6px;
`;

const PageButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#111827' : '#ffffff')};
  color: ${(props) => (props.active ? '#ffffff' : '#374151')};
  border: 1px solid ${(props) => (props.active ? '#111827' : '#d1d5db')};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #111827;
  }
`;

const ViewerBody = styled.div`
  padding: 32px;
  background-color: #f3f4f6;
  min-height: 350px;
  display: flex;
  justify-content: center;
`;

const DocumentPage = styled.div`
  background: #ffffff;
  border: 1px solid #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 750px;
  min-height: 450px;
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 24px;
`;

const PageText = styled.div`
  font-size: 15px;
  color: #1f2937;
  line-height: 1.8;
  white-space: pre-wrap;
`;

const DocumentPlaceholder = styled.div`
  text-align: center;
  align-self: center;
  color: #6b7280;

  button {
    margin-top: 12px;
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
`;
