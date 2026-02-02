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
  Button,
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import type { Customer, UserPermissions, Stakeholder } from '../../../data/customerMockData';

interface StakeholdersSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

const getStakeholderIcon = (type: string) => {
  switch (type) {
    case 'eläkeyhtiö':
      return <BusinessIcon sx={{ color: '#E53935' }} />;
    case 'tapaturmavakuutus':
      return <SecurityIcon sx={{ color: '#FF9800' }} />;
    case 'työterveyshuolto':
      return <LocalHospitalIcon sx={{ color: '#4CAF50' }} />;
    case 'etukumppani':
      return <CardGiftcardIcon sx={{ color: '#9C27B0' }} />;
    default:
      return <BusinessIcon sx={{ color: '#666' }} />;
  }
};

const getStakeholderTypeLabel = (type: string) => {
  switch (type) {
    case 'eläkeyhtiö':
      return 'Eläkeyhtiö';
    case 'tapaturmavakuutus':
      return 'Tapaturmavakuutusyhtiö';
    case 'työterveyshuolto':
      return 'Työterveyshuolto';
    case 'etukumppani':
      return 'Etukumppani';
    default:
      return type;
  }
};

// Shared card styles for consistency
const cardStyles = {
  backgroundColor: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderRadius: 2,
  height: '100%',
};

const StakeholderCard: React.FC<{ stakeholder: Stakeholder; canEdit: boolean }> = ({
  stakeholder,
  canEdit,
}) => (
  <Card sx={cardStyles}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {getStakeholderIcon(stakeholder.type)}
          <Box>
            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {getStakeholderTypeLabel(stakeholder.type)}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35', lineHeight: 1.2, mt: 0.25 }}>
              {stakeholder.name}
            </Typography>
          </Box>
        </Box>
        {canEdit && (
          <Button startIcon={<EditIcon />} size="small" sx={{ borderRadius: 2 }}>
            Muokkaa
          </Button>
        )}
      </Box>

      <List disablePadding dense>
        {stakeholder.contactPerson && (
          <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemText
              primary="Yhteyshenkilö"
              secondary={stakeholder.contactPerson}
              primaryTypographyProps={{ variant: 'caption', color: '#666' }}
              secondaryTypographyProps={{ fontWeight: 500, color: '#2C2B35' }}
            />
          </ListItem>
        )}
        {stakeholder.email && (
          <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <EmailIcon sx={{ fontSize: 16, color: '#999' }} />
            </ListItemIcon>
            <ListItemText
              primary={stakeholder.email}
              primaryTypographyProps={{ fontSize: '0.85rem', color: '#2C2B35' }}
            />
          </ListItem>
        )}
        {stakeholder.phone && (
          <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <PhoneIcon sx={{ fontSize: 16, color: '#999' }} />
            </ListItemIcon>
            <ListItemText
              primary={stakeholder.phone}
              primaryTypographyProps={{ fontSize: '0.85rem', color: '#2C2B35' }}
            />
          </ListItem>
        )}
        {stakeholder.accountNumber && (
          <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemText
              primary="Tilinumero"
              secondary={stakeholder.accountNumber}
              primaryTypographyProps={{ variant: 'caption', color: '#666' }}
              secondaryTypographyProps={{ fontFamily: 'monospace', color: '#2C2B35' }}
            />
          </ListItem>
        )}
        {stakeholder.policyNumber && (
          <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemText
              primary="Vakuutusnumero"
              secondary={stakeholder.policyNumber}
              primaryTypographyProps={{ variant: 'caption', color: '#666' }}
              secondaryTypographyProps={{ fontFamily: 'monospace', color: '#2C2B35' }}
            />
          </ListItem>
        )}
      </List>

      {stakeholder.notes && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
            {stakeholder.notes}
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

export const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({
  customer,
  permissions,
}) => {
  // Group stakeholders by type
  const pensionCompanies = customer.stakeholders.filter((s) => s.type === 'eläkeyhtiö');
  const insuranceCompanies = customer.stakeholders.filter((s) => s.type === 'tapaturmavakuutus');
  const healthcareProviders = customer.stakeholders.filter((s) => s.type === 'työterveyshuolto');
  const benefitPartners = customer.stakeholders.filter((s) => s.type === 'etukumppani');

  const sectionGroupHeaderStyles = {
    fontWeight: 700,
    color: '#2C2B35',
    mb: 2,
    pb: 1,
    borderBottom: '2px solid #E53935',
    display: 'inline-block',
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Pension Companies */}
        {pensionCompanies.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={sectionGroupHeaderStyles}>
              Eläkeyhtiö
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {pensionCompanies.map((stakeholder) => (
                <Grid key={stakeholder.id} size={{ xs: 12, md: 6 }}>
                  <StakeholderCard stakeholder={stakeholder} canEdit={permissions.canEditStakeholders} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Insurance Companies */}
        {insuranceCompanies.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={sectionGroupHeaderStyles}>
              Tapaturmavakuutusyhtiö
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {insuranceCompanies.map((stakeholder) => (
                <Grid key={stakeholder.id} size={{ xs: 12, md: 6 }}>
                  <StakeholderCard stakeholder={stakeholder} canEdit={permissions.canEditStakeholders} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Healthcare Providers */}
        {healthcareProviders.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={sectionGroupHeaderStyles}>
              Työterveyshuolto
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {healthcareProviders.map((stakeholder) => (
                <Grid key={stakeholder.id} size={{ xs: 12, md: 6 }}>
                  <StakeholderCard stakeholder={stakeholder} canEdit={permissions.canEditStakeholders} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Benefit Partners */}
        {benefitPartners.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={sectionGroupHeaderStyles}>
              Etukumppanit
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {benefitPartners.map((stakeholder) => (
                <Grid key={stakeholder.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <StakeholderCard stakeholder={stakeholder} canEdit={permissions.canEditStakeholders} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
