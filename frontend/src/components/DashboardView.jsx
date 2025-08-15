// components/DashboardView.jsx
import React, { useState } from 'react';
import './AdminPanel.css';

import StatisticsPanel from './StatisticsPanel';
import FinancialsPanel from './FinancialsPanel';
import WorkflowStatsPanel from './WorkflowStatsPanel';
import TemplatesPanel from './TemplatesPanel';

export default function DashboardView({
  data,
  aggregated,
  proCount,
  teamCount,
  estimatedRevenue,
  userById,
  // subs & sorting for Revenue
  allSubsRows,
  activeSubsRows,
  incompleteSubsRows,
  sortedActiveSubs,
  sortedIncompleteSubs,
  handleSort,
  sortIndicator,
}) {
  const TABS = [
    { key: 'platform', label: 'Platform Usage Metrics' },
    { key: 'revenue', label: 'Revenue Metrics' },
    { key: 'models', label: 'Models & Templates Usage' },
  ];
  const [tab, setTab] = useState('platform');

  return (
    <div className="dashboard">
      <div className="tabbar">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-item${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'platform' && (
        <StatisticsPanel data={data} aggregated={aggregated} />
      )}

      {tab === 'revenue' && (
        <FinancialsPanel
          subscriptions={allSubsRows}
          userById={userById}
          aggregated={aggregated}
          proCount={proCount}
          teamCount={teamCount}
          estimatedRevenue={estimatedRevenue}
          handleSort={handleSort}
          sortIndicator={sortIndicator}
          sortedActiveSubs={sortedActiveSubs}
          sortedIncompleteSubs={sortedIncompleteSubs}
          onDownloadAll={() => {
            const rows = allSubsRows;
            const csv = [
              Object.keys(rows[0] || {}).join(','),
              ...rows.map(r => Object.values(r).map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')),
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'subscriptions.csv'; a.click();
            URL.revokeObjectURL(url);
          }}
          onDownloadActive={() => {
            const rows = activeSubsRows;
            const csv = [
              Object.keys(rows[0] || {}).join(','),
              ...rows.map(r => Object.values(r).map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')),
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'active_subscriptions.csv'; a.click();
            URL.revokeObjectURL(url);
          }}
          onDownloadIncomplete={() => {
            const rows = incompleteSubsRows;
            const csv = [
              Object.keys(rows[0] || {}).join(','),
              ...rows.map(r => Object.values(r).map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')),
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'incomplete_subscriptions.csv'; a.click();
            URL.revokeObjectURL(url);
          }}
        />
      )}

      {tab === 'models' && (
        <div className="cards-wrapper">
          {/* Top: Workflow stats (charts/metrics) */}
          <WorkflowStatsPanel workflows={data.workflow || []} />
          {/* Bottom: Templates table */}
          <div className="table-card" style={{ marginTop: 24 }}>
            <div className="table-header">
              <div className="table-name">Templates</div>
            </div>
            <div className="table-body">
              <TemplatesPanel templates={data.templates || []} userById={userById} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
