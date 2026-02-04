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
  Avatar,
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import {
  standardBenefits,
  optionalBenefitGroups,
  discountCodes,
  employeeSelections,
  categoryLabels,
} from '../../data/mockData';

const COLORS = ['#E53935', '#FF6F60', '#FFD600', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#795548'];

// Gradient backgrounds for a more modern look
const gradients = {
  primary: 'linear-gradient(135deg, #E53935 0%, #FF6F60 100%)',
  success: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
  info: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
  warning: 'linear-gradient(135deg, #FB8C00 0%, #FFA726 100%)',
  purple: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
};

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
      {/* Hero Section with Gradient */}
      <Box
        sx={{
          background: gradients.primary,
          borderRadius: 4,
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            right: 100,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
              Henkilöstöetujesi yhteenveto
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
              Kaikki työsuhde-etusi yhdessä paikassa
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <TrendingUpIcon sx={{ color: '#fff' }} />
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  {standardBenefits.filter((b) => b.status === 'active').length + employeeSelections.length} aktiivista etua
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <StarIcon sx={{ color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Premium-tason edut
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                Kokonaisarvo vuodessa
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', my: 1 }}>
                {totalValue.toLocaleString('fi-FI')} €
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Vakioedut + valinnaiset edut
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Pie chart - Now full width for better visibility */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Etujen jakautuminen kategorioittain
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#1a1a1a"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${(value as number).toLocaleString('fi-FI')} €`, 'Arvo']}
                      contentStyle={{
                        backgroundColor: '#2a2a2a',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: 20 }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick links with enhanced styling */}
        {quickLinks.map((link, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={link.path}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  '& .card-gradient': {
                    opacity: 1,
                  },
                  '& .arrow-icon': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
              onClick={() => navigate(link.path)}
            >
              {/* Top gradient accent */}
              <Box
                sx={{
                  height: 4,
                  background: index === 0 ? gradients.success : index === 1 ? gradients.info : gradients.warning,
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: index === 0 ? gradients.success : index === 1 ? gradients.info : gradients.warning,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      }}
                    >
                      {link.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowForwardIcon
                    className="arrow-icon"
                    sx={{
                      color: 'text.secondary',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent/highlighted benefits with enhanced cards */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StarIcon sx={{ color: '#FFD700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Suosituimmat etusi
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/benefits/standard')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Näytä kaikki
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {standardBenefits.slice(0, 4).map((benefit, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={benefit.id}>
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${COLORS[index]}15 0%, ${COLORS[index]}05 100%)`,
                        border: '1px solid',
                        borderColor: `${COLORS[index]}30`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: `0 8px 25px ${COLORS[index]}20`,
                        },
                      }}
                      onClick={() => navigate('/benefits/standard')}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: COLORS[index],
                          mb: 1.5,
                        }}
                      />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {benefit.name.fi}
                      </Typography>
                      <Typography variant="h5" sx={{ color: COLORS[index], fontWeight: 800 }}>
                        {benefit.value.amount.toLocaleString('fi-FI')} €
                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
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
