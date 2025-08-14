import React, { useEffect, useState, useMemo } from 'react';
import './AdminPanel.css';

import FinancialsPanel from './FinancialsPanel';
import StatisticsPanel from './StatisticsPanel';
import TemplatesPanel from './TemplatesPanel';
import UserManagementPanel from './UserManagementPanel';
import WorkflowStatsPanel from './WorkflowStatsPanel';
import DownloadButton, { DownloadIcon } from './DownloadButton';

const BASE_URL = 'http://localhost:8000';
const TABLES = [
  'account',
  'templates',
  'session',
  'subscription',
  'user',
  'user_stats',
  'workflow',
  'workspace',
  'workspace_invitation',
];

// CSV utility
const toCSV = (rows) => {
  if (!rows || !rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    if (val == null) return '';
    const s = String(val).replaceAll('"', '""');
    return `"${s}"`;
  };
  return [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
};

const downloadCSV = (filename, rows) => {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const fetchAllData = async () => {
  const results = {};
  await Promise.all(
    TABLES.map(async (table) => {
      try {
        const res = await fetch(`${BASE_URL}/data/${table}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${table} fetch failed: ${res.status} ${text}`);
        }
        const json = await res.json();
        results[table] = json.data || [];
      } catch (e) {
        console.error(`Error fetching ${table}:`, e);
        results[table] = [];
      }
    })
  );
  return results;
};

const buildUserRows = (data) => {
  const users = Array.isArray(data.user) ? data.user : [];
  const stats = Array.isArray(data.user_stats) ? data.user_stats : [];
  const subs  = Array.isArray(data.subscription) ? data.subscription : [];

  const statsByUser = Object.fromEntries(stats.map((s) => [s.user_id, s]));
  const subByUser   = Object.fromEntries(subs.map((s) => [s.reference_id, s]));

  return users.map((u) => ({
    user: u,
    stats: statsByUser[u.id] || {},
    subscription: subByUser[u.id] || {},
  }));
};

const aggregateStats = (arr = []) =>
  arr.reduce(
    (acc, s) => {
      if (!s) return acc;
      acc.total_manual_executions   += s.total_manual_executions   || 0;
      acc.total_api_calls           += s.total_api_calls           || 0;
      acc.total_webhook_triggers    += s.total_webhook_triggers    || 0;
      acc.total_scheduled_executions+= s.total_scheduled_executions|| 0;
      acc.total_tokens_used         += s.total_tokens_used         || 0;
      acc.total_chat_executions     += s.total_chat_executions     || 0;
      acc.total_cost                += s.total_cost                || 0;
      return acc;
    },
    {
      total_manual_executions: 0,
      total_api_calls: 0,
      total_webhook_triggers: 0,
      total_scheduled_executions: 0,
      total_tokens_used: 0,
      total_chat_executions: 0,
      total_cost: 0,
    }
  );

const countByPlan = (subs = [], plan) => subs.filter((s) => s.plan === plan).length;
const filterByStatus = (subs = [], status) => subs.filter((s) => s.status === status && s.stripe_customer_id);

const sections = [
  { name: 'Workflow Stats',    key: 'workflow_stats'   },
  { name: 'Financials',        key: 'financials'       },
  { name: 'Statistics',        key: 'statistics'       },
  { name: 'Templates',         key: 'templates_list'   },
  { name: 'User Database',     key: 'user_management'  },
];

export default function AdminPanel() {
  const [data, setData]             = useState({});
  const [userRows, setUserRows]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [currentSection, setCurrentSection] = useState('workflow_stats');
  const [sortConfig, setSortConfig] = useState({ table: null, key: null, direction: null });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const d = await fetchAllData();
      setData(d);
      setUserRows(buildUserRows(d));
      setLoading(false);
    })();
  }, []);

  // Derived
  const subscriptions    = data.subscription || [];
  const userStatsArray   = data.user_stats   || [];
  const templates        = data.templates    || [];
  const aggregated       = aggregateStats(userStatsArray);
  const proCount         = countByPlan(subscriptions, 'pro');
  const teamCount        = countByPlan(subscriptions, 'team');
  const estimatedRevenue= proCount * 20 + teamCount * 40;
  const userById         = Object.fromEntries((data.user||[]).map((u) => [u.id, u]));

  const activeSubsRaw     = filterByStatus(subscriptions, 'active');
  const incompleteSubsRaw = filterByStatus(subscriptions, 'incomplete');
  const activeEmails      = new Set(activeSubsRaw.map((s) => userById[s.reference_id]?.email).filter(Boolean));
  const incompleteSubs    = incompleteSubsRaw.filter((s) => !activeEmails.has(userById[s.reference_id]?.email));

  // CSV rows
  const userManagementRows = userRows.map(({ user, stats, subscription }) => ({
    user_id: user.id,
    name: user.name,
    email: user.email,
    email_verified: user.email_verified ? 'Yes' : 'No',
    created_at: user.created_at,
    plan: subscription.plan,
    subscription_status: subscription.status,
    total_api_calls: stats.total_api_calls,
    total_cost: stats.total_cost,
    total_manual_executions: stats.total_manual_executions,
    total_webhook_triggers: stats.total_webhook_triggers,
    total_scheduled_executions: stats.total_scheduled_executions,
    total_tokens_used: stats.total_tokens_used,
    total_chat_executions: stats.total_chat_executions,
    current_usage_limit: stats.current_usage_limit,
    usage_limit_updated_at: stats.usage_limit_updated_at,
    current_period_cost: stats.current_period_cost,
    last_period_cost: stats.last_period_cost,
    last_active: stats.last_active,
    seats: subscription.seats,
  }));

  const allSubsRows       = subscriptions.map((s) => ({
    subscription_id: s.id,
    plan: s.plan,
    status: s.status,
    stripe_customer_id: s.stripe_customer_id,
    stripe_subscription_id: s.stripe_subscription_id,
    user_email: userById[s.reference_id]?.email,
    period_start: s.period_start,
    period_end: s.period_end,
    cancel_at_period_end: s.cancel_at_period_end ? 'Yes' : 'No',
    seats: s.seats,
  }));
  const activeSubsRows     = activeSubsRaw.map((s) => ({ ...s, user_email: userById[s.reference_id]?.email }));
  const incompleteSubsRows = incompleteSubs.map((s) => ({ ...s, user_email: userById[s.reference_id]?.email }));

  // Sorting
  const handleSort = (table, key) =>
    setSortConfig((prev) => {
      if (prev.table !== table || prev.key !== key) return { table, key, direction: 'asc' };
      if (prev.direction === 'asc') return { table, key, direction: 'desc' };
      return { table: null, key: null, direction: null };
    });

  const sortIndicator = (table, key) => {
    if (sortConfig.table === table && sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const sortData = (arr, key, dir) => {
    if (!key || !dir) return arr;
    return [...arr].sort((a, b) => {
      let av = a[key] ?? '';
      let bv = b[key] ?? '';
      const aN = parseFloat(av), bN = parseFloat(bv);
      const bothNum = !isNaN(aN) && !isNaN(bN);
      let cmp = bothNum ? aN - bN : String(av).localeCompare(String(bv), undefined, { numeric: true });
      if (cmp === 0) return 0;
      return dir === 'asc' ? (cmp < 0 ? -1 : 1) : (cmp < 0 ? 1 : -1);
    });
  };

  const sortedUserRows = useMemo(
    () =>
      sortConfig.table === 'user_management'
        ? sortData(userManagementRows, sortConfig.key, sortConfig.direction).map((r) => ({
            user: { id: r.user_id, name: r.name, email: r.email, created_at: r.created_at, email_verified: r.email_verified === 'Yes' },
            stats: r,
            subscription: r,
          }))
        : userRows,
    [sortConfig, userRows]
  );

  const sortedAllSubs = useMemo(
    () => (sortConfig.table === 'all_subs' ? sortData(allSubsRows, sortConfig.key, sortConfig.direction) : allSubsRows),
    [sortConfig, allSubsRows]
  );

  const sortedActiveSubsFinal = useMemo(
    () =>
      sortConfig.table === 'active_subs'
        ? sortData(activeSubsRows, sortConfig.key, sortConfig.direction)
        : activeSubsRows,
    [sortConfig, activeSubsRows]
  );

  const sortedIncompleteSubsFinal = useMemo(
    () =>
      sortConfig.table === 'incomplete_subs'
        ? sortData(incompleteSubsRows, sortConfig.key, sortConfig.direction)
        : incompleteSubsRows,
    [sortConfig, incompleteSubsRows]
  );

  const title = sections.find((s) => s.key === currentSection)?.name || '';

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="brand">Forge v2</div>
        <div className="nav">
          {sections.map((s) => (
            <div
              key={s.key}
              className={`sidebar-item${currentSection === s.key ? ' active' : ''}`}
              onClick={() => setCurrentSection(s.key)}
            >
              {s.name}
            </div>
          ))}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="title">{title}</div>
        </div>

        <section className="content">
          {loading ? (
            <div className="loading">Loading data…</div>
          ) : currentSection === 'workflow_stats' ? (
            (() => {
              console.log('Rendering WorkflowStatsPanel with workflows:', data.workflow);
              return <WorkflowStatsPanel workflows={data.workflow || []} />;
            })()
          ) : currentSection === 'financials' ? (
            <FinancialsPanel
              subscriptions={allSubsRows}
              userById={userById}
              aggregated={aggregated}
              proCount={proCount}
              teamCount={teamCount}
              estimatedRevenue={estimatedRevenue}
              handleSort={handleSort}
              sortIndicator={sortIndicator}
              sortedActiveSubs={sortedActiveSubsFinal}
              sortedIncompleteSubs={sortedIncompleteSubsFinal}
              onDownloadAll={() => downloadCSV('subscriptions.csv', allSubsRows)}
              onDownloadActive={() => downloadCSV('active_subscriptions.csv', activeSubsRows)}
              onDownloadIncomplete={() => downloadCSV('incomplete_subscriptions.csv', incompleteSubsRows)}
            />
          ) : currentSection === 'statistics' ? (
            <StatisticsPanel data={data} aggregated={aggregated} />
          ) : currentSection === 'templates_list' ? (
            <TemplatesPanel templates={templates} userById={userById} />
          ) : (
            <UserManagementPanel
              sortedUserRows={sortedUserRows}
              handleSort={handleSort}
              sortIndicator={sortIndicator}
              onDownloadUsers={() => downloadCSV('users.csv', userManagementRows)}
            />
          )}
        </section>
      </main>
    </div>
  );
}
