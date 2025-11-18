import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsEngine } from "@/lib/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface RevenueChartProps {
  type: 'daily' | 'category' | 'hourly';
  title: string;
  description?: string;
}

export const RevenueChart = ({ type, title, description }: RevenueChartProps) => {
  const getData = () => {
    try {
      switch (type) {
        case 'daily': {
          const chartData = analyticsEngine.getDailyRevenueChart();
          // Se não há dados do analytics, usar dados das transações
          if (chartData.every(d => d.revenue === 0)) {
            const transactions = JSON.parse(localStorage.getItem('cafe-connect-transactions') || '[]');
            const today = new Date();
            const last30Days = [];
            
            for (let i = 29; i >= 0; i--) {
              const date = new Date(today);
              date.setDate(date.getDate() - i);
              
              const dayTransactions = transactions.filter((t: any) => 
                new Date(t.date).toDateString() === date.toDateString() && t.status === 'completed'
              );
              
              const dayRevenue = dayTransactions.reduce((sum: number, t: any) => sum + t.netAmount, 0);
              
              last30Days.push({
                date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                revenue: dayRevenue
              });
            }
            return last30Days;
          }
          return chartData;
        }
        case 'category': {
          const chartData = analyticsEngine.getCategoryRevenueChart();
          // Se não há dados, usar dados das transações
          if (chartData.length === 0) {
            const transactions = JSON.parse(localStorage.getItem('cafe-connect-transactions') || '[]');
            const categoryStats: { [key: string]: number } = {};
            
            transactions.filter((t: any) => t.status === 'completed').forEach((t: any) => {
              categoryStats[t.category] = (categoryStats[t.category] || 0) + t.netAmount;
            });
            
            const total = Object.values(categoryStats).reduce((sum: number, val: number) => sum + val, 0);
            
            return Object.entries(categoryStats).map(([category, revenue]) => ({
              category,
              revenue,
              percentage: total > 0 ? (revenue / total) * 100 : 0
            })).sort((a, b) => b.revenue - a.revenue);
          }
          return chartData;
        }
        case 'hourly':
          return analyticsEngine.getHourlyRevenueChart();
        default:
          return [];
      }
    } catch (error) {
      console.error('Erro ao obter dados do gráfico:', error);
      return [];
    }
  };

  const data = getData();

  const renderChart = () => {
    switch (type) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'category':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'hourly':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};