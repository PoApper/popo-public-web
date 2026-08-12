import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { PoPoAxios, popoApiUrl } from '@/lib/axios.instance';
import DocumentViewer from '@/components/extracurricular/DocumentViewer';
import { ActivityReport, Activity } from '@/components/extracurricular/types';

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const { reportId } = router.query;

  const [report, setReport] = useState<ActivityReport | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
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

  const fileUrl = `${popoApiUrl}/activity-report/${report.uuid}/file`;

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
            {report.period && <MetaTag>{report.period}</MetaTag>}
            {report.major && <MetaTag>{report.major}</MetaTag>}
            {report.grade && <MetaTag>{report.grade}</MetaTag>}
            {report.author && <MetaTag>작성자: {report.author}</MetaTag>}
          </MetaRow>

          <ReportTitle>{report.title}</ReportTitle>

          <DownloadBar>
            <FileBox>
              <FileIcon type={report.fileType}>
                {report.fileType.toUpperCase()}
              </FileIcon>
              <FileName>{report.fileName}</FileName>
            </FileBox>
            <DownloadButton href={fileUrl} download={report.fileName}>
              다운로드
            </DownloadButton>
          </DownloadBar>
        </HeaderCard>

        <ViewerSection>
          <ViewerBody>
            <DocumentViewer
              reportUuid={report.uuid}
              fileName={report.fileName}
              fileType={report.fileType}
            />
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
  font-weight: 500;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
`;

const ReportTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
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
  font-weight: 500;
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

const DownloadButton = styled.a`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ViewerSection = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const ViewerBody = styled.div`
  padding: 32px;
  background-color: #f3f4f6;
  min-height: 350px;
  display: flex;
  justify-content: center;
`;
