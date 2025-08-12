import React from 'react';
import './AdminPanel.css';
import DownloadButton from './DownloadButton';

export default function FinancialsPanel({
  subscriptions,
  userById,
  aggregated,
  proCount,
  teamCount,
  estimatedRevenue,
  handleSort,
  sortIndicator,
  sortedActiveSubs,
  sortedIncompleteSubs,
  onDownloadAll,
  onDownloadActive,
  onDownloadIncomplete,
}) {
  return (
    <div className="financials-overview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="stat-card large">
            <div className="stat-title">Total Usage</div>
            <div className="stat-value">${aggregated.total_cost.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pro Plan Members</div>
            <div className="stat-value">{proCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Team Plan Members</div>
            <div className="stat-value">{teamCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Est. Monthly Revenue</div>
            <div className="stat-value">${estimatedRevenue.toFixed(2)}</div>
          </div>
        </div>
        <DownloadButton onClick={onDownloadAll} />
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#e3e8ff' }}>Active Subscriptions</h3>
          <DownloadButton onClick={onDownloadActive} />
        </div>
        <div className="user-management">
          <table className="user-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('active_subs', 'id')}>Subscription ID{sortIndicator('active_subs','id')}</th>
                <th onClick={() => handleSort('active_subs', 'plan')}>Plan{sortIndicator('active_subs','plan')}</th>
                <th onClick={() => handleSort('active_subs', 'status')}>Status{sortIndicator('active_subs','status')}</th>
                <th onClick={() => handleSort('active_subs', 'stripe_customer_id')}>Stripe Customer{sortIndicator('active_subs','stripe_customer_id')}</th>
                <th onClick={() => handleSort('active_subs', 'stripe_subscription_id')}>Stripe Sub ID{sortIndicator('active_subs','stripe_subscription_id')}</th>
                <th onClick={() => handleSort('active_subs', 'user_email')}>User Email{sortIndicator('active_subs','user_email')}</th>
                <th onClick={() => handleSort('active_subs', 'period_start')}>Period Start{sortIndicator('active_subs','period_start')}</th>
                <th onClick={() => handleSort('active_subs', 'period_end')}>Period End{sortIndicator('active_subs','period_end')}</th>
                <th onClick={() => handleSort('active_subs', 'cancel_at_period_end')}>Cancel at Period End{sortIndicator('active_subs','cancel_at_period_end')}</th>
                <th onClick={() => handleSort('active_subs', 'seats')}>Seats{sortIndicator('active_subs','seats')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedActiveSubs.map((sub, i) => (
                <tr key={sub.id || i}>
                  <td>{sub.id}</td>
                  <td>{sub.plan}</td>
                  <td>{sub.status}</td>
                  <td>{sub.stripe_customer_id}</td>
                  <td>{sub.stripe_subscription_id || '—'}</td>
                  <td>{sub.user_email || '—'}</td>
                  <td>{sub.period_start ? new Date(sub.period_start).toLocaleString() : '—'}</td>
                  <td>{sub.period_end ? new Date(sub.period_end).toLocaleString() : '—'}</td>
                  <td>{sub.cancel_at_period_end ? 'Yes' : 'No'}</td>
                  <td>{sub.seats ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <h3 style={{ color: '#e3e8ff' }}>Incomplete Subscriptions</h3>
          <DownloadButton onClick={onDownloadIncomplete} />
        </div>
        <div className="user-management">
          <table className="user-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('incomplete_subs', 'id')}>Subscription ID{sortIndicator('incomplete_subs','id')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'plan')}>Plan{sortIndicator('incomplete_subs','plan')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'status')}>Status{sortIndicator('incomplete_subs','status')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'stripe_customer_id')}>Stripe Customer{sortIndicator('incomplete_subs','stripe_customer_id')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'stripe_subscription_id')}>Stripe Sub ID{sortIndicator('incomplete_subs','stripe_subscription_id')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'user_email')}>User Email{sortIndicator('incomplete_subs','user_email')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'period_start')}>Period Start{sortIndicator('incomplete_subs','period_start')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'period_end')}>Period End{sortIndicator('incomplete_subs','period_end')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'cancel_at_period_end')}>Cancel at Period End{sortIndicator('incomplete_subs','cancel_at_period_end')}</th>
                <th onClick={() => handleSort('incomplete_subs', 'seats')}>Seats{sortIndicator('incomplete_subs','seats')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedIncompleteSubs.map((sub, i) => (
                <tr key={sub.id || i}>
                  <td>{sub.id}</td>
                  <td>{sub.plan}</td>
                  <td>{sub.status}</td>
                  <td>{sub.stripe_customer_id}</td>
                  <td>{sub.stripe_subscription_id || '—'}</td>
                  <td>{sub.user_email || '—'}</td>
                  <td>{sub.period_start ? new Date(sub.period_start).toLocaleString() : '—'}</td>
                  <td>{sub.period_end ? new Date(sub.period_end).toLocaleString() : '—'}</td>
                  <td>{sub.cancel_at_period_end ? 'Yes' : 'No'}</td>
                  <td>{sub.seats ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
