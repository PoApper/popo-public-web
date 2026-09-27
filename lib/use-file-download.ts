import { useEffect, useRef, useState } from 'react';

export const useFileDownload = (fileUrl: string, fileName: string) => {
  const requestRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    setIsDownloading(false);
    setDownloadError(null);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [fileUrl, fileName]);

  const download = async () => {
    if (requestRef.current) return;
    const request = new AbortController();
    requestRef.current = request;
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(fileUrl, {
        credentials: 'include',
        signal: request.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (request.signal.aborted) return;

      // A same-origin blob URL preserves the filename for cross-origin API files.
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      try {
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        // Allow the browser to start saving, even if the page is unmounted.
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      }
    } catch {
      if (!request.signal.aborted) {
        setDownloadError('파일을 내려받지 못했습니다. 다시 시도해주세요.');
      }
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null;
        setIsDownloading(false);
      }
    }
  };

  return { download, isDownloading, downloadError };
};
