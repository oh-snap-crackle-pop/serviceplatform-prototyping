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
  Button,
  Divider,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import FlightIcon from '@mui/icons-material/Flight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface ServicesProductsSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

const getServiceIcon = (iconType: string) => {
  const iconProps = { sx: { color: '#E53935', fontSize: 24 } };

  switch (iconType) {
    case 'payroll':
      return <AccountBalanceIcon {...iconProps} />;
    case 'time':
      return <AccessTimeIcon {...iconProps} />;
    case 'hr':
      return <PeopleIcon {...iconProps} />;
    case 'humhum':
      return <BusinessIcon {...iconProps} />;
    case 'travel':
      return <FlightIcon {...iconProps} />;
    case 'robot':
      return <SmartToyIcon {...iconProps} />;
    case 'analytics':
      return <AnalyticsIcon {...iconProps} />;
    case 'consulting':
      return <SupportAgentIcon {...iconProps} />;
    default:
      return <BusinessIcon {...iconProps} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 18 }} />;
    case 'inactive':
      return <CancelIcon sx={{ color: '#F44336', fontSize: 18 }} />;
    case 'pending':
      return <PendingIcon sx={{ color: '#FF9800', fontSize: 18 }} />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Aktiivinen';
    case 'inactive':
      return 'Ei käytössä';
    case 'pending':
      return 'Tulossa';
    default:
      return status;
  }
};

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

export const ServicesProductsSection: React.FC<ServicesProductsSectionProps> = ({
  customer,
  permissions,
}) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Services */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <BusinessIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Käytössä olevat palvelut
                </Typography>
              </Box>
              <List disablePadding>
                {customer.services.map((service) => (
                  <ListItem key={service.id} disablePadding sx={{ py: 0.75 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getServiceIcon(service.icon)}
                    </ListItemIcon>
                    <ListItemText
                      primary={service.name}
                      primaryTypographyProps={{
                        sx: {
                          color: service.isActive ? '#2C2B35' : '#999',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        },
                      }}
                    />
                    <Chip
                      label={service.isActive ? 'Käytössä' : 'Ei käytössä'}
                      size="small"
                      color={service.isActive ? 'success' : 'default'}
                      sx={{
                        fontSize: '0.7rem',
                        ...(service.isActive ? {} : { backgroundColor: '#E8E8E8', color: '#666' }),
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Infrastructure Diagram */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <ImageIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Infrakuva
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '#F8F8F8',
                  borderRadius: 2,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 180,
                  border: '1px dashed #E0E0E0',
                }}
              >
                <ImageIcon sx={{ fontSize: 48, color: '#BDBDBD', mb: 1.5 }} />
                <Typography variant="body2" sx={{ color: '#666', mb: 2, fontWeight: 500 }}>
                  Järjestelmäarkkitehtuuri
                </Typography>
                <Button variant="outlined" size="small" href={customer.infrastructureDiagramUrl} sx={{ borderRadius: 2 }}>
                  Avaa infrakuva
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <AccountBalanceIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Liittymät
                </Typography>
              </Box>
              <List disablePadding>
                {customer.integrations.map((integration, index) => (
                  <React.Fragment key={integration.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getStatusIcon(integration.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={integration.name}
                        secondary={
                          <>
                            <Typography component="span" variant="caption" sx={{ color: '#666' }}>
                              {integration.type}
                            </Typography>
                            {integration.description && (
                              <Typography component="span" variant="caption" sx={{ color: '#999', display: 'block' }}>
                                {integration.description}
                              </Typography>
                            )}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 500, color: '#2C2B35' }}
                      />
                      <Chip
                        label={getStatusLabel(integration.status)}
                        size="small"
                        color={
                          integration.status === 'active'
                            ? 'success'
                            : integration.status === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                        sx={{
                          fontSize: '0.7rem',
                          ...(integration.status !== 'active' && integration.status !== 'pending'
                            ? { backgroundColor: '#E8E8E8', color: '#666' }
                            : {}),
                        }}
                      />
                    </ListItem>
                    {index < customer.integrations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Platform Features */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CheckCircleIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Palvelualustan ominaisuudet
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {customer.platformFeatures.map((feature) => (
                  <Chip
                    key={feature.id}
                    label={feature.name}
                    icon={feature.isEnabled ? <CheckCircleIcon /> : undefined}
                    color={feature.isEnabled ? 'primary' : 'default'}
                    variant={feature.isEnabled ? 'filled' : 'outlined'}
                    sx={{
                      '& .MuiChip-icon': { fontSize: 16 },
                      ...(!feature.isEnabled ? { borderColor: '#BDBDBD', color: '#666' } : {}),
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bank Account */}
        <Grid size={{ xs: 12 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceWalletIcon sx={{ color: '#E53935' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    Maksajatunnus / Pankkitili
                  </Typography>
                </Box>
                {permissions.canEditBankAccount && (
                  <Button startIcon={<EditIcon />} size="small" sx={{ borderRadius: 2 }}>
                    Muokkaa
                  </Button>
                )}
              </Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#E53935' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Maksajatunnus
                      </Typography>
                      <Typography sx={{ fontWeight: 500, color: '#2C2B35' }}>
                        {customer.bankAccount.payerId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Pankkitili
                    </Typography>
                    <Typography sx={{ fontWeight: 500, color: '#2C2B35', fontFamily: 'monospace' }}>
                      {customer.bankAccount.bankAccount}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Pankki
                    </Typography>
                    <Typography sx={{ fontWeight: 500, color: '#2C2B35' }}>
                      {customer.bankAccount.bankName}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
