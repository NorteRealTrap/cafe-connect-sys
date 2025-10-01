import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsEngine } from "@/lib/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface RevenueChartProps {
  type: 'daily' | 'category' | 'hourly';
  title: string;
  description?: string;
}

export const RevenueChart = ({ type, title, description }: RevenueChartProps) => {
  const getData = () => {
    switch (type) {
      case 'daily':
        return analyticsEngine.getDailyRevenueChart();
      case 'category':
        return analyticsEngine.getCategoryRevenueChart();
      case 'hourly':
        return analyticsEngine.getHourlyRevenueChart();
      default:
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