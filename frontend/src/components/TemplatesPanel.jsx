import React from 'react';
import './AdminPanel.css';

export default function TemplatesPanel({ templates, userById }) {
  return (
    <div className="user-management">
      <table className="user-table">
        <thead>
          <tr>
            <th>Workflow ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Name</th>
            <th>Description</th>
            <th>Author</th>
            <th>Views</th>
            <th>Stars</th>
            <th>Color</th>
            <th>Icon</th>
            <th>Category</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id}>
              <td>{t.workflow_id}</td>
              <td>{userById[t.user_id]?.name || '—'}</td>
              <td>{userById[t.user_id]?.email || '—'}</td>
              <td>{t.name}</td>
              <td>{t.description}</td>
              <td>{t.author}</td>
              <td>{t.views}</td>
              <td>{t.stars}</td>
              <td>{t.color}</td>
              <td>{t.icon}</td>
              <td>{t.category}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{new Date(t.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
