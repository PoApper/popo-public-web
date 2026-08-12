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
/** @rhwp/core 로 렌더링할 수 있는 형식 */
const HWP_RENDERABLE = ['hwp', 'hwpx'];

/** scripts/copy-rhwp-wasm.mjs 가 public/ 으로 옮겨두는 파서 바이너리 */
const RHWP_WASM_URL = '/rhwp_bg.wasm';

/**
 * 업로드된 원본 문서를 실제로 렌더링한다.
 * - pdf       : 브라우저 내장 뷰어(iframe)
 * - docx      : docx-preview 로 DOM 렌더링
 * - hwp/hwpx  : @rhwp/core (WASM 파서)로 페이지별 SVG 생성
 * - 그 외     : 렌더러가 없어 다운로드만 안내
 */
const DocumentViewer: React.FC<Props> = ({
  reportUuid,
  fileName,
  fileType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hwpContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  const type = (fileType || '').toLowerCase();
  const fileUrl = `${popoApiUrl}/activity-report/${reportUuid}/file`;
  const isDocx = DOCX_RENDERABLE.includes(type);
  const isPdf = NATIVELY_VIEWABLE.includes(type);
  const isHwp = HWP_RENDERABLE.includes(type);

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

  useEffect(() => {
    if (!isHwp) return;

    let cancelled = false;
    // wasm 이 들고 있는 문서. 언마운트 시 free() 로 메모리를 돌려줘야 한다.
    let hwpDocument: { free: () => void } | null = null;

    const render = async () => {
      setStatus('loading');
      try {
        // wasm 을 받아오고 DOM 을 만지므로 클라이언트에서만 불러온다.
        const rhwp = await import('@rhwp/core');

        // 렌더러가 글자 폭을 잴 때 호출하는 콜백. init 전에 있어야 한다.
        const globalScope = globalThis as unknown as Record<string, unknown>;
        if (typeof globalScope.measureTextWidth !== 'function') {
          const context = document.createElement('canvas').getContext('2d');
          globalScope.measureTextWidth = (font: string, text: string) => {
            if (!context) return 0;
            context.font = font;
            return context.measureText(text).width;
          };
        }

        // 이미 초기화됐다면 wasm-bindgen 이 알아서 캐시된 인스턴스를 돌려준다.
        await rhwp.default({ module_or_path: RHWP_WASM_URL });

        const res = await fetch(fileUrl, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());
        if (cancelled) return;

        const parsed = new rhwp.HwpDocument(bytes);
        if (cancelled) {
          parsed.free();
          return;
        }
        hwpDocument = parsed;

        const pages: string[] = [];
        const pageCount = parsed.pageCount();
        for (let page = 0; page < pageCount; page += 1) {
          pages.push(parsed.renderPageSvg(page));
        }

        if (cancelled || !hwpContainerRef.current) return;
        hwpContainerRef.current.innerHTML = pages
          .map((svg) => `<div class="rhwp-page">${svg}</div>`)
          .join('');
        setStatus('ready');
      } catch (err) {
        console.error('HWP 문서를 렌더링하지 못했습니다:', err);
        if (!cancelled) setStatus('error');
      }
    };

    render();
    return () => {
      cancelled = true;
      hwpDocument?.free();
    };
  }, [fileUrl, isHwp]);

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

  if (isHwp) {
    return (
      <>
        {status === 'loading' && (
          <Notice>한글 문서를 불러오는 중입니다…</Notice>
        )}
        {status === 'error' && (
          <Notice>
            문서를 표시하지 못했습니다.{' '}
            <a href={fileUrl} download={fileName}>
              원본 내려받기
            </a>
          </Notice>
        )}
        <HwpContainer ref={hwpContainerRef} $hidden={status !== 'ready'} />
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

const HwpContainer = styled.div<{ $hidden: boolean }>`
  display: ${(props) => (props.$hidden ? 'none' : 'block')};
  overflow-x: auto;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;

  .rhwp-page {
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    margin: 0 auto 16px auto;
    width: fit-content;

    &:last-child {
      margin-bottom: 0;
    }
  }

  svg {
    display: block;
    max-width: 100%;
    height: auto;
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
