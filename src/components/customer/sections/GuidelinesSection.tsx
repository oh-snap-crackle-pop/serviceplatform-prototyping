import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { Customer, UserPermissions, Guideline } from '../../../data/customerMockData';

interface GuidelinesSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

const cardStyles = {
  backgroundColor: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderRadius: 2,
  height: '100%',
};

const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2.5,
};

const getCategoryIcon = (category: Guideline['category']) => {
  switch (category) {
    case 'palkkahallinto':
      return <PaymentsIcon />;
    case 'työaika':
      return <AccessTimeIcon />;
    case 'lomat':
      return <BeachAccessIcon />;
    case 'edut':
      return <CardGiftcardIcon />;
    case 'raportointi':
      return <AssessmentIcon />;
    case 'muu':
      return <MoreHorizIcon />;
    default:
      return <GavelIcon />;
  }
};

const getCategoryLabel = (category: Guideline['category']) => {
  switch (category) {
    case 'palkkahallinto':
      return 'Palkkahallinto';
    case 'työaika':
      return 'Työaika';
    case 'lomat':
      return 'Lomat';
    case 'edut':
      return 'Edut';
    case 'raportointi':
      return 'Raportointi';
    case 'muu':
      return 'Muut';
    default:
      return category;
  }
};

const getCategoryColor = (category: Guideline['category']) => {
  switch (category) {
    case 'palkkahallinto':
      return '#E53935';
    case 'työaika':
      return '#2196F3';
    case 'lomat':
      return '#4CAF50';
    case 'edut':
      return '#FF9800';
    case 'raportointi':
      return '#9C27B0';
    case 'muu':
      return '#607D8B';
    default:
      return '#666';
  }
};

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({ customer }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  // Group guidelines by category
  const groupedGuidelines = customer.guidelines.reduce((acc, guideline) => {
    if (!acc[guideline.category]) {
      acc[guideline.category] = [];
    }
    acc[guideline.category].push(guideline);
    return acc;
  }, {} as Record<string, Guideline[]>);

  // Define category order for consistent display
  const categoryOrder: Guideline['category'][] = ['palkkahallinto', 'työaika', 'lomat', 'edut', 'raportointi', 'muu'];
  const sortedCategories = Object.keys(groupedGuidelines).sort(
    (a, b) => categoryOrder.indexOf(a as Guideline['category']) - categoryOrder.indexOf(b as Guideline['category'])
  );

  return (
    <Box>
      {/* Introduction */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          backgroundColor: '#F5F9FF',
          border: '1px solid #E3EDFC',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <InfoOutlinedIcon sx={{ color: '#2196F3', mt: 0.25 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2C2B35', mb: 0.5 }}>
              Yhdessä sovitut linjaukset
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Tällä sivulla on dokumentoitu {customer.name} -asiakkaan kanssa yhdessä sovitut
              palkkaprosessiin liittyvät linjaukset ja käytännöt. Näitä linjauksia noudatetaan
              palkanlaskennan eri vaiheissa ja tehtävissä.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Category Summary */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {sortedCategories.map((category) => (
          <Chip
            key={category}
            icon={getCategoryIcon(category as Guideline['category'])}
            label={`${getCategoryLabel(category as Guideline['category'])} (${groupedGuidelines[category].length})`}
            size="small"
            sx={{
              backgroundColor: `${getCategoryColor(category as Guideline['category'])}15`,
              color: getCategoryColor(category as Guideline['category']),
              fontWeight: 500,
              '& .MuiChip-icon': {
                color: getCategoryColor(category as Guideline['category']),
              },
            }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {sortedCategories.map((category) => (
          <Grid size={{ xs: 12, lg: 6 }} key={category}>
            <Card sx={{ ...cardStyles, height: 'auto' }}>
              <CardContent>
                <Box sx={sectionHeaderStyles}>
                  <Box
                    sx={{
                      color: getCategoryColor(category as Guideline['category']),
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {getCategoryIcon(category as Guideline['category'])}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    {getCategoryLabel(category as Guideline['category'])}
                  </Typography>
                </Box>

                {groupedGuidelines[category].map((guideline, index) => (
                  <React.Fragment key={guideline.id}>
                    <Box sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#2C2B35', flex: 1 }}>
                          {guideline.title}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ color: '#666', mb: 1.5 }}>
                        {guideline.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Sovittu: {formatDate(guideline.agreedDate)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          {guideline.agreedWith}
                        </Typography>
                      </Box>

                      <List disablePadding dense>
                        {guideline.details.map((detail, detailIndex) => (
                          <ListItem key={detailIndex} disablePadding sx={{ py: 0.3 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckIcon sx={{ color: getCategoryColor(category as Guideline['category']), fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={detail}
                              primaryTypographyProps={{
                                variant: 'body2',
                                color: '#2C2B35',
                                lineHeight: 1.5,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {guideline.notes && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 1.5,
                            backgroundColor: '#FFF8E1',
                            borderRadius: 1,
                            borderLeft: '3px solid #FFC107',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: '#5D4037', fontWeight: 500 }}>
                            Huom: {guideline.notes}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {index < groupedGuidelines[category].length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
