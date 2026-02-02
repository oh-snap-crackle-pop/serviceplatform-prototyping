import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import EuroIcon from '@mui/icons-material/Euro';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { benefitAnalytics, departments, locations, categoryLabels } from '../../data/mockData';

const COLORS = ['#E53935', '#FF6F60', '#FFD600', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#795548'];

export const AnalyticsDashboard: React.FC = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const metrics = [
    {
      title: 'Työntekijöitä etujen piirissä',
      value: benefitAnalytics.totalEmployees,
      icon: <PeopleIcon />,
      color: '#2196F3',
      format: (v: number) => v.toString(),
    },
    {
      title: 'Vuosittaiset etukulut',
      value: benefitAnalytics.totalAnnualCost,
      icon: <EuroIcon />,
      color: '#4CAF50',
      format: (v: number) => `${(v / 1000).toLocaleString('fi-FI')}k €`,
    },
    {
      title: 'Keskimääräinen etuarvo/hlö',
      value: benefitAnalytics.averageBenefitValue,
      icon: <TrendingUpIcon />,
      color: '#FF9800',
      format: (v: number) => `${v.toLocaleString('fi-FI')} €`,
    },
    {
      title: 'Valinnaisten osallistumisaste',
      value: benefitAnalytics.optionalParticipationRate,
      icon: <CheckCircleIcon />,
      color: '#E53935',
      format: (v: number) => `${v}%`,
    },
  ];

  // Prepare pie chart data for optional selections
  const optionalPieData = benefitAnalytics.optionalSelections.slice(0, 5).map((sel) => ({
    name: sel.optionName,
    value: sel.count,
  }));

  // Prepare bar chart data for monthly costs
  const monthlyBarData = benefitAnalytics.monthlyTrend.map((item) => ({
    month: new Date(item.month + '-01').toLocaleDateString('fi-FI', { month: 'short' }),
    cost: Math.round(item.cost / 1000),
  }));

  // Prepare benefit distribution data
  const distributionData = benefitAnalytics.benefitDistribution.map((item) => ({
    category: categoryLabels[item.category] || item.category,
    employees: item.count,
    totalValue: item.totalValue,
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Henkilöstöetujen analytiikka
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Yhteenveto henkilöstöetujen käytöstä ja kustannuksista
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Osasto</InputLabel>
          <Select
            value={departmentFilter}
            label="Osasto"
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="all">Kaikki osastot</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Toimipiste</InputLabel>
          <Select
            value={locationFilter}
            label="Toimipiste"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value="all">Kaikki toimipisteet</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Metrics cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {metric.format(metric.value)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: `${metric.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: metric.color,
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly costs chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Kuukausittaiset etukulut (tuhatta €)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333',
                        borderRadius: 8,
                      }}
                      formatter={(value) => [`${value}k €`, 'Kulut']}
                    />
                    <Bar dataKey="cost" fill="#E53935" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Optional benefits pie chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Valinnaisten etujen jakauma
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={optionalPieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {optionalPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333',
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Benefits distribution table */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Etujen jakautuminen kategorioittain
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kategoria</TableCell>
                      <TableCell align="right">Työntekijöitä</TableCell>
                      <TableCell align="right">Kokonaisarvo (€)</TableCell>
                      <TableCell align="right">Keskiarvo/hlö (€)</TableCell>
                      <TableCell align="right">Osuus</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {distributionData.map((row) => {
                      const percentage = (
                        (row.totalValue / benefitAnalytics.totalAnnualCost) *
                        100
                      ).toFixed(1);
                      const avgPerPerson = Math.round(row.totalValue / row.employees);

                      return (
                        <TableRow key={row.category}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.category}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{row.employees}</TableCell>
                          <TableCell align="right">
                            {row.totalValue.toLocaleString('fi-FI')}
                          </TableCell>
                          <TableCell align="right">
                            {avgPerPerson.toLocaleString('fi-FI')}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 60,
                                  height: 8,
                                  backgroundColor: 'action.hover',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${percentage}%`,
                                    height: '100%',
                                    backgroundColor: 'primary.main',
                                    borderRadius: 1,
                                  }}
                                />
                              </Box>
                              <Typography variant="body2">{percentage}%</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
