import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PieChartIcon from '@mui/icons-material/PieChart';
import PercentIcon from '@mui/icons-material/Percent';
import EditIcon from '@mui/icons-material/Edit';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface AccountingSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

// Shared card styles for consistency
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

export const AccountingSection: React.FC<AccountingSectionProps> = ({ customer, permissions }) => {
  const { accounting } = customer;

  const getCostTypeLabel = (type: string) => {
    switch (type) {
      case 'kustannuspaikka':
        return 'Kustannuspaikka';
      case 'projekti':
        return 'Projekti';
      default:
        return 'Muu';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Reporting Date & Fiscal Year */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CalendarTodayIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Aikataulu
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, textAlign: 'center', border: '1px solid #EEEEEE' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#E53935', lineHeight: 1 }}>
                      {accounting.reportingDate}.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Raportointipäivä (kuukauden)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, textAlign: 'center', border: '1px solid #EEEEEE' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C2B35', lineHeight: 1.2 }}>
                      {accounting.fiscalYearStart.replace('-', '.')} - {accounting.fiscalYearEnd.replace('-', '.')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Tilikausi
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Groups */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <AccountTreeIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Tiliöintiryhmät
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Koodi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Nimi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounting.accountGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell sx={{ fontFamily: 'monospace', color: '#E53935' }}>
                          {group.code}
                        </TableCell>
                        <TableCell sx={{ color: '#2C2B35' }}>{group.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Allocations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <PieChartIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Kustannuskohdisteet
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Koodi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Nimi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Tyyppi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounting.costAllocations.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell sx={{ fontFamily: 'monospace', color: '#E53935' }}>
                          {allocation.code}
                        </TableCell>
                        <TableCell sx={{ color: '#2C2B35' }}>{allocation.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={getCostTypeLabel(allocation.type)}
                            size="small"
                            color={allocation.type === 'projekti' ? 'primary' : 'default'}
                            sx={{
                              fontSize: '0.7rem',
                              ...(allocation.type !== 'projekti'
                                ? { backgroundColor: '#E8E8E8', color: '#2C2B35' }
                                : {}),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Accrual Percentages */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PercentIcon sx={{ color: '#E53935' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    Jaksotusprosentit
                  </Typography>
                </Box>
                {permissions.canEditAccruals && (
                  <Button startIcon={<EditIcon />} size="small" sx={{ borderRadius: 2 }}>
                    Muokkaa
                  </Button>
                )}
              </Box>
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                Muutokset jaksotusprosentteihin tulee toimittaa kirjanpitoon.
              </Alert>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Tyyppi</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#2C2B35' }}>Prosentti</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#2C2B35' }}>Muokattavissa</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounting.accrualPercentages.map((accrual) => (
                      <TableRow key={accrual.id}>
                        <TableCell sx={{ color: '#2C2B35' }}>{accrual.type}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#E53935' }}>
                          {accrual.percentage.toFixed(1)} %
                        </TableCell>
                        <TableCell align="center">
                          {accrual.isCustomerEditable ? (
                            <Chip label="Kyllä" size="small" color="success" sx={{ fontSize: '0.7rem' }} />
                          ) : (
                            <Chip label="Ei" size="small" color="default" sx={{ fontSize: '0.7rem', backgroundColor: '#E8E8E8', color: '#666' }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
