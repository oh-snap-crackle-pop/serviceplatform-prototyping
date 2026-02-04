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
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import type { Customer, UserPermissions, WorkInstruction } from '../../../data/customerMockData';

interface WorkInstructionsSectionProps {
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

const getCategoryIcon = (category: WorkInstruction['category']) => {
  switch (category) {
    case 'palkanlaskenta':
      return <PaymentsIcon sx={{ color: '#E53935' }} />;
    case 'henkilöstöhallinto':
      return <PeopleIcon sx={{ color: '#2196F3' }} />;
    case 'raportointi':
      return <AssessmentIcon sx={{ color: '#4CAF50' }} />;
    case 'järjestelmät':
      return <SettingsIcon sx={{ color: '#9C27B0' }} />;
    default:
      return <DescriptionIcon sx={{ color: '#666' }} />;
  }
};

const getCategoryLabel = (category: WorkInstruction['category']) => {
  switch (category) {
    case 'palkanlaskenta':
      return 'Palkanlaskenta';
    case 'henkilöstöhallinto':
      return 'Henkilöstöhallinto';
    case 'raportointi':
      return 'Raportointi';
    case 'järjestelmät':
      return 'Järjestelmät';
    default:
      return category;
  }
};

const getCategoryColor = (category: WorkInstruction['category']) => {
  switch (category) {
    case 'palkanlaskenta':
      return '#E53935';
    case 'henkilöstöhallinto':
      return '#2196F3';
    case 'raportointi':
      return '#4CAF50';
    case 'järjestelmät':
      return '#9C27B0';
    default:
      return '#666';
  }
};

export const WorkInstructionsSection: React.FC<WorkInstructionsSectionProps> = ({ customer, permissions }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  // Group instructions by category
  const groupedInstructions = customer.workInstructions.reduce((acc, instruction) => {
    if (!acc[instruction.category]) {
      acc[instruction.category] = [];
    }
    acc[instruction.category].push(instruction);
    return acc;
  }, {} as Record<string, WorkInstruction[]>);

  if (!permissions.canViewInternalSections) {
    return null;
  }

  return (
    <Box>
      <Alert
        severity="info"
        sx={{
          mb: 3,
          backgroundColor: '#FFF3E0',
          '& .MuiAlert-icon': { color: '#E53935' }
        }}
      >
        <Typography variant="body2">
          Nämä työohjeet ovat Integratan sisäisiä ohjeita tämän asiakkaan palkanlaskentaan liittyen.
          Asiakkaat eivät näe tätä osiota.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Overview Card */}
        <Grid size={{ xs: 12 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <MenuBookIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Asiakaskohtaiset työohjeet
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                Tästä osiosta löydät kaikki {customer.name} -asiakkaan palkanlaskentaan ja
                henkilöstöhallintoon liittyvät asiakaskohtaiset työohjeet ja prosessikuvaukset.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.keys(groupedInstructions).map((category) => (
                  <Chip
                    key={category}
                    icon={getCategoryIcon(category as WorkInstruction['category'])}
                    label={`${getCategoryLabel(category as WorkInstruction['category'])} (${groupedInstructions[category].length})`}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(category as WorkInstruction['category'])}15`,
                      color: getCategoryColor(category as WorkInstruction['category']),
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions by Category */}
        {Object.entries(groupedInstructions).map(([category, instructions]) => (
          <Grid size={{ xs: 12 }} key={category}>
            <Card sx={{ ...cardStyles, height: 'auto' }}>
              <CardContent>
                <Box sx={sectionHeaderStyles}>
                  {getCategoryIcon(category as WorkInstruction['category'])}
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    {getCategoryLabel(category as WorkInstruction['category'])}
                  </Typography>
                </Box>

                {instructions.map((instruction) => (
                  <Accordion
                    key={instruction.id}
                    sx={{
                      mb: 1,
                      boxShadow: 'none',
                      border: '1px solid #E0E0E0',
                      '&:before': { display: 'none' },
                      borderRadius: '8px !important',
                      '&.Mui-expanded': { margin: '0 0 8px 0' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: '#FAFAFA',
                        borderRadius: '8px',
                        '&.Mui-expanded': {
                          borderRadius: '8px 8px 0 0',
                          minHeight: 48,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                        <DescriptionIcon sx={{ color: getCategoryColor(category as WorkInstruction['category']), fontSize: 20 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: '#2C2B35' }}>
                            {instruction.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Päivitetty: {formatDate(instruction.lastUpdated)}
                          </Typography>
                        </Box>
                        {instruction.documentUrl && (
                          <Link
                            href={instruction.documentUrl}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              fontSize: '0.75rem',
                              color: '#E53935',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            Avaa dokumentti
                          </Link>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        {instruction.description}
                      </Typography>

                      {instruction.steps && instruction.steps.length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2C2B35', mb: 1 }}>
                            Työvaiheet:
                          </Typography>
                          <List disablePadding dense>
                            {instruction.steps.map((step, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircleOutlineIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={step}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: '#2C2B35',
                                    lineHeight: 1.6,
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
