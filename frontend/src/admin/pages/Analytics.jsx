import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/analytics/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!analyticsData) return <div className="error">No data available</div>;

  // Prepare chart data
  const messagesChartData = {
    labels: analyticsData.messages_by_date.map(item => item.date),
    datasets: [
      {
        label: 'Messages per Day',
        data: analyticsData.messages_by_date.map(item => item.count),
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  const skillsChartData = {
    labels: analyticsData.skills_by_category.map(item => item.category),
    datasets: [
      {
        data: analyticsData.skills_by_category.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const projectsChartData = {
    labels: analyticsData.projects_by_status.map(item => item.status),
    datasets: [
      {
        data: analyticsData.projects_by_status.map(item => item.count),
        backgroundColor: ['#2ECC71', '#F39C12', '#E74C3C'],
      },
    ],
  };

  const activityChartData = {
    labels: analyticsData.activity_by_action.map(item => item.action),
    datasets: [
      {
        label: 'User Activity',
        data: analyticsData.activity_by_action.map(item => item.count),
        backgroundColor: 'rgba(46, 204, 113, 0.5)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1,
      },
    ],
  };

  const visitsChartData = {
    labels: analyticsData.visits_by_day.map(item => item.date),
    datasets: [
      {
        label: 'Visits per Day',
        data: analyticsData.visits_by_day.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(155, 89, 182, 0.5)',
        borderColor: 'rgba(155, 89, 182, 1)',
        tension: 0.1,
      },
    ],
  };

  const deviceChartData = {
    labels: analyticsData.device_types.map(item => item.device_type || 'unknown'),
    datasets: [
      {
        data: analyticsData.device_types.map(item => item.count),
        backgroundColor: ['#3498DB', '#2ECC71', '#E74C3C', '#F39C12'],
      },
    ],
  };

  const browserChartData = {
    labels: analyticsData.browsers.map(item => item.browser || 'unknown'),
    datasets: [
      {
        data: analyticsData.browsers.map(item => item.count),
        backgroundColor: ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6'],
      },
    ],
  };

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Messages by Day</h3>
          <Bar data={messagesChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card">
          <h3>Skills by Category</h3>
          <Pie data={skillsChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card">
          <h3>Projects by Status</h3>
          <Doughnut data={projectsChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card">
          <h3>User Activity</h3>
          <Bar data={activityChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card full-width">
          <h3>Visits per Day</h3>
          <Line data={visitsChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card">
          <h3>Device Types</h3>
          <Pie data={deviceChartData} options={{ responsive: true }} />
        </div>
        
        <div className="chart-card">
          <h3>Browsers</h3>
          <Pie data={browserChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;