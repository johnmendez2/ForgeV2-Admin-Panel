import React from 'react';
import './AdminPanel.css';
import DownloadButton from './DownloadButton';

export default function UserManagementPanel({
  sortedUserRows,
  handleSort,
  sortIndicator,
  onDownloadUsers,
}) {
  return (
    <div className="user-management">
      <DownloadButton onClick={onDownloadUsers} />

      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('user_management', 'user_id')}>User ID{sortIndicator('user_management','user_id')}</th>
            <th onClick={() => handleSort('user_management', 'name')}>Name{sortIndicator('user_management','name')}</th>
            <th onClick={() => handleSort('user_management', 'email')}>Email{sortIndicator('user_management','email')}</th>
            <th onClick={() => handleSort('user_management', 'created_at')}>Created At{sortIndicator('user_management','created_at')}</th>
            <th onClick={() => handleSort('user_management', 'plan')}>Plan{sortIndicator('user_management','plan')}</th>
            <th onClick={() => handleSort('user_management', 'subscription_status')}>Subscription Status{sortIndicator('user_management','subscription_status')}</th>
            <th onClick={() => handleSort('user_management', 'total_api_calls')}>API Calls{sortIndicator('user_management','total_api_calls')}</th>
            <th onClick={() => handleSort('user_management', 'total_cost')}>Total Usage{sortIndicator('user_management','total_cost')}</th>
            <th onClick={() => handleSort('user_management', 'total_manual_executions')}>Manual Execs{sortIndicator('user_management','total_manual_executions')}</th>
            <th onClick={() => handleSort('user_management', 'total_webhook_triggers')}>Webhook Triggers{sortIndicator('user_management','total_webhook_triggers')}</th>
            <th onClick={() => handleSort('user_management', 'total_scheduled_executions')}>Scheduled Execs{sortIndicator('user_management','total_scheduled_executions')}</th>
            <th onClick={() => handleSort('user_management', 'total_tokens_used')}>Tokens Used{sortIndicator('user_management','total_tokens_used')}</th>
            <th onClick={() => handleSort('user_management', 'total_chat_executions')}>Chat Execs{sortIndicator('user_management','total_chat_executions')}</th>
            <th onClick={() => handleSort('user_management', 'current_usage_limit')}>Usage Limit{sortIndicator('user_management','current_usage_limit')}</th>
            <th onClick={() => handleSort('user_management', 'usage_limit_updated_at')}>Limit Updated{sortIndicator('user_management','usage_limit_updated_at')}</th>
            <th onClick={() => handleSort('user_management', 'current_period_cost')}>Current Period Cost{sortIndicator('user_management','current_period_cost')}</th>
            <th onClick={() => handleSort('user_management', 'last_period_cost')}>Last Period Cost{sortIndicator('user_management','last_period_cost')}</th>
            <th onClick={() => handleSort('user_management', 'last_active')}>Last Active{sortIndicator('user_management','last_active')}</th>
            <th onClick={() => handleSort('user_management', 'seats')}>Seats{sortIndicator('user_management','seats')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedUserRows.map(({ user, stats, subscription }, i) => (
            <tr key={user?.id || i}>
              <td>{user?.id || '—'}</td>
              <td>{user?.name}</td>
              <td>{user?.email}</td>
              <td>{user?.created_at ? new Date(user.created_at).toLocaleString() : '—'}</td>
              <td>{subscription?.plan || 'free'}</td>
              <td>{subscription?.status || 'none'}</td>
              <td>{stats?.total_api_calls ?? 0}</td>
              <td>{stats?.total_cost ?? 0}</td>
              <td>{stats?.total_manual_executions ?? 0}</td>
              <td>{stats?.total_webhook_triggers ?? 0}</td>
              <td>{stats?.total_scheduled_executions ?? 0}</td>
              <td>{stats?.total_tokens_used ?? 0}</td>
              <td>{stats?.total_chat_executions ?? 0}</td>
              <td>{stats?.current_usage_limit ?? '—'}</td>
              <td>{stats?.usage_limit_updated_at ? new Date(stats.usage_limit_updated_at).toLocaleString() : '—'}</td>
              <td>{stats?.current_period_cost ?? 0}</td>
              <td>{stats?.last_period_cost ?? 0}</td>
              <td>{stats?.last_active ? new Date(stats.last_active).toLocaleString() : '—'}</td>
              <td>{subscription?.seats ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
