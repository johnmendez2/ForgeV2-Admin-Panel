import React, { useMemo } from 'react';

const WorkflowStatsPanel = ({ workflows = [] }) => {
  // Debug logging
  console.log('WorkflowStatsPanel received workflows:', workflows);
  
  const metrics = useMemo(() => {
    console.log('WorkflowStatsPanel metrics calculation started with workflows:', workflows);
    
    if (!workflows || !workflows.length) {
      console.log('No workflows data available');
      return {
        totalWorkflows: 0,
        deployedWorkflows: 0,
        inProgressWorkflows: 0,
        byTriggerType: {
          manual: { total: 0, deployed: 0, inProgress: 0 },
          webhook: { total: 0, deployed: 0, inProgress: 0 },
          scheduled: { total: 0, deployed: 0, inProgress: 0 },
          other: { total: 0, deployed: 0, inProgress: 0 }
        },
        deploymentRate: 0,
        recentDeployments: [],
        totalRunCount: 0,
        averageRunCount: 0,
        activeWorkflows: 0
      };
    }

    const totalWorkflows = workflows.length;
    const deployedWorkflows = workflows.filter(w => w.is_deployed === true || w.is_deployed === 'true').length;
    const inProgressWorkflows = totalWorkflows - deployedWorkflows;

    // Categorize by trigger type
    const byTriggerType = {
      manual: { total: 0, deployed: 0, inProgress: 0 },
      webhook: { total: 0, deployed: 0, inProgress: 0 },
      scheduled: { total: 0, deployed: 0, inProgress: 0 },
      other: { total: 0, deployed: 0, inProgress: 0 }
    };

    workflows.forEach(workflow => {
      let triggerType = 'other';
      
      // Extract trigger type from workflow state
      if (workflow.state && workflow.state.blocks) {
        const starterBlock = Object.values(workflow.state.blocks).find(
          block => block.type === 'starter'
        );
        
        if (starterBlock && starterBlock.subBlocks && starterBlock.subBlocks.startWorkflow) {
          const startWorkflowValue = starterBlock.subBlocks.startWorkflow.value;
          console.log(`Workflow ${workflow.name} has startWorkflow value:`, startWorkflowValue);
          
          if (startWorkflowValue === 'manual') {
            triggerType = 'manual';
          } else if (startWorkflowValue === 'webhook') {
            triggerType = 'webhook';
          } else if (startWorkflowValue === 'schedule' || startWorkflowValue === 'daily' || startWorkflowValue === 'weekly' || startWorkflowValue === 'monthly' || startWorkflowValue === 'hourly') {
            triggerType = 'scheduled';
          }
        } else {
          console.log(`Workflow ${workflow.name} missing startWorkflow subBlock:`, starterBlock);
          // Default to manual if no startWorkflow value is found
          triggerType = 'manual';
        }
      } else {
        console.log(`Workflow ${workflow.name} missing state or blocks:`, workflow.state);
        // Default to manual if no state structure is found
        triggerType = 'manual';
      }

      byTriggerType[triggerType].total++;
      if (workflow.is_deployed === true || workflow.is_deployed === 'true') {
        byTriggerType[triggerType].deployed++;
      } else {
        byTriggerType[triggerType].inProgress++;
      }
    });

    const deploymentRate = totalWorkflows > 0 ? (deployedWorkflows / totalWorkflows) * 100 : 0;

    // Calculate additional metrics
    const totalRunCount = workflows.reduce((sum, w) => sum + (parseInt(w.run_count) || 0), 0);
    const averageRunCount = totalWorkflows > 0 ? totalRunCount / totalWorkflows : 0;
    const activeWorkflows = workflows.filter(w => (parseInt(w.run_count) || 0) > 0).length;

    // Get recent deployments (last 10)
    const recentDeployments = workflows
      .filter(w => (w.is_deployed === true || w.is_deployed === 'true') && w.deployed_at)
      .sort((a, b) => new Date(b.deployed_at) - new Date(a.deployed_at))
      .slice(0, 10)
      .map(w => ({
        name: w.name,
        deployedAt: w.deployed_at,
        userId: w.user_id,
        runCount: w.run_count || 0
      }));

    const finalMetrics = {
      totalWorkflows,
      deployedWorkflows,
      inProgressWorkflows,
      byTriggerType,
      deploymentRate,
      recentDeployments,
      totalRunCount,
      averageRunCount,
      activeWorkflows
    };
    
    console.log('Calculated metrics:', finalMetrics);
    return finalMetrics;
  }, [workflows]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed': return '#10B981';
      case 'inProgress': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div className="workflow-stats-panel">
      {/* Key Metrics Overview (match Statistics styles) */}
      <div className="stats-grid">
        <div className="stat-card large">
          <div className="stat-title">Total Workflows</div>
          <div className="stat-value">{metrics.totalWorkflows}</div>
        </div>
        <div className="stat-card large">
          <div className="stat-title">Deployed</div>
          <div className="stat-value">{metrics.deployedWorkflows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">In Progress</div>
          <div className="stat-value">{metrics.inProgressWorkflows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Deployment Rate</div>
          <div className="stat-value">{metrics.deploymentRate.toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Active</div>
          <div className="stat-value">{metrics.activeWorkflows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Runs</div>
          <div className="stat-value">{metrics.totalRunCount}</div>
        </div>
      </div>

      {/* Workflow Breakdown by Trigger Type */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-name">Workflows by Trigger Type</div>
        </div>
        <div className="table-body">
          <div className="stats-grid">
            {Object.entries(metrics.byTriggerType).map(([type, counts]) => (
              <div key={type} className="stat-card">
                <div className="stat-title" style={{ textTransform: 'capitalize' }}>
                  {type}
                </div>
                <div className="stat-value" style={{ fontSize: '2rem' }}>{counts.total}</div>
                <div className="data-box" style={{ maxHeight: 'unset', background:'#0b0d1d' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Deployed</span>
                    <span>{counts.deployed}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6 }}>
                    <span>In Progress</span>
                    <span>{counts.inProgress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="table-card" style={{ marginTop: 24 }}>
        <div className="table-header">
          <div className="table-name">Recent Deployments</div>
        </div>
        <div className="table-body">
          {metrics.recentDeployments.length > 0 ? (
            <div className="deployments-table">
              <div className="table-header">
                <div className="header-cell">Workflow Name</div>
                <div className="header-cell">Deployed At</div>
                <div className="header-cell">User ID</div>
                <div className="header-cell">Run Count</div>
              </div>
              {metrics.recentDeployments.map((deployment, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{deployment.name}</div>
                  <div className="table-cell">{formatDate(deployment.deployedAt)}</div>
                  <div className="table-cell">{deployment.userId}</div>
                  <div className="table-cell">{deployment.runCount}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-deployments">No recent deployments found</div>
          )}
        </div>
      </div>

      {/* Workflow Performance */}
      <div className="stats-grid" style={{ marginTop: 24 }}>
        <div className="stat-card">
          <div className="stat-title">Average Run Count</div>
          <div className="stat-value">{metrics.averageRunCount.toFixed(1)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Active Workflow Rate</div>
          <div className="stat-value">{metrics.totalWorkflows > 0 ? `${((metrics.activeWorkflows / metrics.totalWorkflows) * 100).toFixed(1)}%` : '0%'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Most Popular Trigger</div>
          <div className="stat-value">
            {(() => {
              const entries = Object.entries(metrics.byTriggerType);
              const mostPopular = entries.reduce((max, current) =>
                current[1].total > max[1].total ? current : max
              );
              return mostPopular[0].charAt(0).toUpperCase() + mostPopular[0].slice(1);
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStatsPanel;
