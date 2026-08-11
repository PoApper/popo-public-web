import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { popoApiUrl } from '@/lib/axios.instance';

interface Props {
  reportUuid: string;
  fileName: string;
  fileType: string;
}

/** 브라우저가 자체 뷰어로 열 수 있는 형식 */
const NATIVELY_VIEWABLE = ['pdf'];
/** docx-preview 로 렌더링할 수 있는 형식 */
const DOCX_RENDERABLE = ['docx'];

/**
 * 업로드된 원본 문서를 실제로 렌더링한다.
 * - pdf : 브라우저 내장 뷰어(iframe)
 * - docx: docx-preview 로 DOM 렌더링
 * - 그 외(hwp/hwpx 등): 렌더러가 없어 다운로드만 안내
 */
const DocumentViewer: React.FC<Props> = ({
  reportUuid,
  fileName,
  fileType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  const type = (fileType || '').toLowerCase();
  const fileUrl = `${popoApiUrl}/activity-report/${reportUuid}/file`;
  const isDocx = DOCX_RENDERABLE.includes(type);
  const isPdf = NATIVELY_VIEWABLE.includes(type);

  useEffect(() => {
    if (!isDocx) return;

    let cancelled = false;
    const render = async () => {
      setStatus('loading');
      try {
        // docx-preview 는 DOM 에 직접 그리므로 클라이언트에서만 불러온다.
        const { renderAsync } = await import('docx-preview');
        const res = await fetch(fileUrl, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = '';
        await renderAsync(blob, containerRef.current, undefined, {
          className: 'docx',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: true,
          breakPages: true,
          experimental: true,
        });
        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('문서를 렌더링하지 못했습니다:', err);
        if (!cancelled) setStatus('error');
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, isDocx]);

  if (isPdf) {
    return (
      <PdfFrame
        src={fileUrl}
        title={fileName}
        onLoad={() => setStatus('ready')}
      />
    );
  }

  if (isDocx) {
    return (
      <>
        {status === 'loading' && <Notice>문서를 불러오는 중입니다…</Notice>}
        {status === 'error' && (
          <Notice>
            문서를 표시하지 못했습니다.{' '}
            <a href={fileUrl} download={fileName}>
              원본 내려받기
            </a>
          </Notice>
        )}
        <DocxContainer ref={containerRef} $hidden={status !== 'ready'} />
      </>
    );
  }

  return (
    <Notice>
      <strong>{type ? type.toUpperCase() : '이'} 형식</strong>은 웹에서 바로 볼
      수 없습니다.
      <br />
      <a href={fileUrl} download={fileName}>
        원본 내려받기
      </a>
    </Notice>
  );
};

export default DocumentViewer;

const PdfFrame = styled.iframe`
  width: 100%;
  height: 80vh;
  min-height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
`;

const DocxContainer = styled.div<{ $hidden: boolean }>`
  display: ${(props) => (props.$hidden ? 'none' : 'block')};
  overflow-x: auto;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;

  .docx-wrapper {
    background: transparent;
    padding: 0;
  }

  .docx {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
`;

const Notice = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.7;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  a {
    color: #2563eb;
    font-weight: 500;
  }
`;
