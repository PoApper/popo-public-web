import { useTranslation } from 'next-i18next/pages';
import { useEffect, useRef, useState } from 'react';

export const useFileDownload = (fileUrl: string, fileName: string) => {
  const { t } = useTranslation('common');
  const requestRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsDownloading(false);
    setHasError(false);
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
    setHasError(false);

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
        setHasError(true);
      }
    } finally {
      if (requestRef.current === request) {
        requestRef.current = null;
        setIsDownloading(false);
      }
    }
  };

  return {
    download,
    isDownloading,
    downloadError: hasError ? t('fileDownload.error') : null,
  };
};
