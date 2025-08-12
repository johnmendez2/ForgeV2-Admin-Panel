import React from 'react';
import './AdminPanel.css';

export default function StatisticsPanel({ data, aggregated }) {
  return (
    <div className="statistics-overview">
      <div className="stats-grid">
        <div className="stat-card large">
          <div className="stat-title">Total Workflows</div>
          <div className="stat-value">{Array.isArray(data.workflow) ? data.workflow.length : 0}</div>
        </div>
        <div className="stat-card large">
          <div className="stat-title">Total Templates</div>
          <div className="stat-value">{Array.isArray(data.templates) ? data.templates.length : 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Manual Executions</div>
          <div className="stat-value">{aggregated.total_manual_executions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">API Calls</div>
          <div className="stat-value">{aggregated.total_api_calls}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Webhook Triggers</div>
          <div className="stat-value">{aggregated.total_webhook_triggers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Scheduled Executions</div>
          <div className="stat-value">{aggregated.total_scheduled_executions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Chat Executions</div>
          <div className="stat-value">{aggregated.total_chat_executions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Tokens Used</div>
          <div className="stat-value">{aggregated.total_tokens_used}</div>
        </div>
      </div>
    </div>
  );
}
