import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TuneIcon from '@mui/icons-material/Tune';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {
  standardBenefits,
  optionalBenefitGroups,
  discountCodes,
  employeeSelections,
  categoryLabels,
} from '../../data/mockData';

const COLORS = ['#E53935', '#FF6F60', '#FFD600', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#795548'];

export const BenefitsDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Calculate total value of all active benefits
  const calculateTotalValue = () => {
    let total = 0;

    // Standard benefits
    standardBenefits
      .filter((b) => b.status === 'active')
      .forEach((benefit) => {
        const { amount, unit } = benefit.value;
        switch (unit) {
          case 'day':
            total += amount * 220; // Working days per year
            break;
          case 'month':
            total += amount * 12;
            break;
          case 'year':
            total += amount;
            break;
          case 'one-time':
            total += amount;
            break;
        }
      });

    // Optional benefits (selected ones)
    employeeSelections.forEach((selection) => {
      const group = optionalBenefitGroups.find((g) => g.id === selection.groupId);
      if (group) {
        const option = group.options.find((o) => o.id === selection.selectedOptionId);
        if (option) {
          const { amount, unit } = option.value;
          switch (unit) {
            case 'month':
              total += amount * 12;
              break;
            case 'year':
              total += amount;
              break;
            case 'one-time':
              total += amount;
              break;
          }
        }
      }
    });

    return total;
  };

  // Prepare data for pie chart
  const preparePieData = () => {
    const categoryTotals: Record<string, number> = {};

    standardBenefits
      .filter((b) => b.status === 'active')
      .forEach((benefit) => {
        const { amount, unit } = benefit.value;
        let annualValue = amount;
        switch (unit) {
          case 'day':
            annualValue = amount * 220;
            break;
          case 'month':
            annualValue = amount * 12;
            break;
        }
        categoryTotals[benefit.category] = (categoryTotals[benefit.category] || 0) + annualValue;
      });

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: categoryLabels[category] || category,
      value: Math.round(value),
    }));
  };

  const totalValue = calculateTotalValue();
  const pieData = preparePieData();

  const quickLinks = [
    {
      title: 'Vakioedut',
      description: `${standardBenefits.filter((b) => b.status === 'active').length} aktiivista etua`,
      icon: <CheckCircleIcon />,
      path: '/benefits/standard',
      color: '#4CAF50',
    },
    {
      title: 'Valinnaiset edut',
      description: `${employeeSelections.length} valittua etua`,
      icon: <TuneIcon />,
      path: '/benefits/optional',
      color: '#2196F3',
    },
    {
      title: 'Alennuskoodit',
      description: `${discountCodes.length} alennuskoodia`,
      icon: <LocalOfferIcon />,
      path: '/benefits/discounts',
      color: '#FF9800',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Henkilöstöetujesi yhteenveto
      </Typography>

      <Grid container spacing={3}>
        {/* Total value card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Etujesi kokonaisarvo vuodessa
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {totalValue.toLocaleString('fi-FI')} €
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sisältää vakioedut ja valinnaiset edut
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Etujen jakautuminen kategorioittain
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${(value as number).toLocaleString('fi-FI')} €`, 'Arvo']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick links */}
        {quickLinks.map((link) => (
          <Grid size={{ xs: 12, md: 4 }} key={link.path}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(link.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: `${link.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: link.color,
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowForwardIcon color="action" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent/highlighted benefits */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Suosituimmat etusi
                </Typography>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/benefits/standard')}
                >
                  Näytä kaikki
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {standardBenefits.slice(0, 4).map((benefit) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={benefit.id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'action.hover',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {benefit.name.fi}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        {benefit.value.amount.toLocaleString('fi-FI')} €
                        <Typography component="span" variant="caption" color="text.secondary">
                          {benefit.value.unit === 'day' && '/pv'}
                          {benefit.value.unit === 'month' && '/kk'}
                          {benefit.value.unit === 'year' && '/v'}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
