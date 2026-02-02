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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Button,
  Divider,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import EditIcon from '@mui/icons-material/Edit';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface PayrollSectionProps {
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

export const PayrollSection: React.FC<PayrollSectionProps> = ({ customer, permissions }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Collective Agreements (TES) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <GavelIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Työehtosopimukset (TES)
                </Typography>
              </Box>
              <List disablePadding>
                {customer.collectiveAgreements.map((tes, index) => (
                  <React.Fragment key={tes.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <DescriptionIcon sx={{ color: '#E53935' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={tes.documentUrl} sx={{ color: '#2C2B35', fontWeight: 500 }}>
                            {tes.name}
                          </Link>
                        }
                        secondary={
                          <>
                            <Chip
                              label={tes.code}
                              size="small"
                              sx={{
                                mr: 1,
                                fontSize: '0.7rem',
                                height: 18,
                                backgroundColor: '#E8E8E8',
                                color: '#2C2B35',
                              }}
                            />
                            {formatDate(tes.validFrom)} - {tes.validTo ? formatDate(tes.validTo) : 'Toistaiseksi'}
                          </>
                        }
                        secondaryTypographyProps={{ sx: { mt: 0.5 } }}
                      />
                    </ListItem>
                    {index < customer.collectiveAgreements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Local Agreements */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon sx={{ color: '#E53935' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    Paikalliset sopimukset
                  </Typography>
                </Box>
                {permissions.canEditLocalAgreements && (
                  <Button startIcon={<EditIcon />} size="small" sx={{ borderRadius: 2 }}>
                    Muokkaa
                  </Button>
                )}
              </Box>
              <List disablePadding>
                {customer.localAgreements.map((agreement, index) => (
                  <React.Fragment key={agreement.id}>
                    <ListItem disablePadding sx={{ py: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontWeight: 600, color: '#2C2B35' }}>
                        {agreement.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        {agreement.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999', mt: 0.5 }}>
                        Voimassa {formatDate(agreement.validFrom)} alkaen
                      </Typography>
                    </ListItem>
                    {index < customer.localAgreements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Groups Table */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ ...cardStyles, height: 'auto' }}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CalendarMonthIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Maksuryhmät, maksupäivät ja palkkakaudet
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Maksuryhmä</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Maksupäivä</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Palkkakausi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#2C2B35' }}>Vastuuhenkilö</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customer.paymentGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell sx={{ color: '#2C2B35', fontWeight: 500 }}>{group.name}</TableCell>
                        <TableCell sx={{ color: '#2C2B35' }}>{group.paymentDate}</TableCell>
                        <TableCell sx={{ color: '#2C2B35' }}>{group.payPeriod}</TableCell>
                        <TableCell sx={{ color: '#666' }}>{group.assignedSpecialist || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Dividers */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CalculateIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Jakajat
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, border: '1px solid #EEEEEE' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#E53935', lineHeight: 1 }}>
                      {customer.dividers.dayDivider}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Päiväjakaja
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, border: '1px solid #EEEEEE' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#E53935', lineHeight: 1 }}>
                      {customer.dividers.hourDivider}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Tuntijakaja
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Experience Calculation */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <TimelineIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Kokemus- ja palvelusvuosilaskenta
                </Typography>
              </Box>
              <Chip label={customer.experienceCalculation.type} color="primary" size="small" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography variant="body2" sx={{ color: '#2C2B35', mb: 2, lineHeight: 1.7 }}>
                {customer.experienceCalculation.description}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2C2B35', mb: 1.5 }}>
                Laskentasäännöt:
              </Typography>
              <List disablePadding dense>
                {customer.experienceCalculation.rules.map((rule, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`• ${rule}`}
                      primaryTypographyProps={{ variant: 'body2', color: '#666', lineHeight: 1.6 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
