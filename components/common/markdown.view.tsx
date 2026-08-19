import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

interface MarkdownViewProps {
  content?: string | null;
  className?: string;
}

const MarkdownWrapper = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: #2b2b2b;
  word-break: break-word;

  p {
    margin-bottom: 0.8em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    font-weight: 700;
    line-height: 1.3;
    color: #111827;
  }

  h1 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  h2 {
    font-size: 1.3em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  h3 {
    font-size: 1.15em;
  }
  h4 {
    font-size: 1.05em;
  }

  ul,
  ol {
    padding-left: 1.5em;
    margin-bottom: 0.8em;
  }

  li {
    margin-bottom: 0.25em;
  }

  blockquote {
    margin: 0.8em 0;
    padding: 0.5em 1em;
    color: #555;
    background-color: #f8f9fa;
    border-left: 4px solid #0056b3;
    border-radius: 2px;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 4px;
    font-family:
      ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
  }

  pre {
    padding: 12px 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
    margin: 0.8em 0;

    code {
      padding: 0;
      background-color: transparent;
    }
  }

  a {
    color: #0366d6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.8em 0;

    th,
    td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
      text-align: left;
    }

    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }

    tr:nth-child(2n) {
      background-color: #f8f9fa;
    }
  }

  hr {
    height: 1px;
    padding: 0;
    margin: 1.2em 0;
    background-color: #e1e4e8;
    border: 0;
  }

  img {
    max-width: 100%;
    border-radius: 6px;
    margin: 0.5em 0;
  }
`;

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  className,
}) => {
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <MarkdownWrapper className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </MarkdownWrapper>
  );
};

export default MarkdownView;
