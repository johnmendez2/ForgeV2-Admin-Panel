import React from 'react';
import './AdminPanel.css';

export const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 17h16" />
    <path d="M12 3v14" />
    <path d="M8 13l4 4 4-4" />
  </svg>
);

export default function DownloadButton({ onClick, title = 'Download CSV' }) {
  return (
    <button className="download-btn" onClick={onClick} title={title}>
      <span className="download-icon-wrapper">
        <DownloadIcon />
      </span>
      <span>Download CSV</span>
    </button>
  );
}
