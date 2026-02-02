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
  Link,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LockIcon from '@mui/icons-material/Lock';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface BillingSectionProps {
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

export const BillingSection: React.FC<BillingSectionProps> = ({ customer, permissions }) => {
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
        {/* Service Descriptions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <DescriptionIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Palvelukuvaukset
                </Typography>
              </Box>
              <List disablePadding>
                {customer.billing.serviceDescriptions.map((desc, index) => (
                  <React.Fragment key={desc.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <DescriptionIcon sx={{ color: '#E53935' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={desc.documentUrl} sx={{ color: '#2C2B35', fontWeight: 500 }}>
                            {desc.name}
                          </Link>
                        }
                        secondary={`Voimassa ${formatDate(desc.validFrom)} alkaen`}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    {index < customer.billing.serviceDescriptions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* General Billing Instructions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <InfoIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Yleiset laskutusohjeet
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#2C2B35', lineHeight: 1.8 }}>
                {customer.billing.generalInstructions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Agreed Billing Principles */}
        <Grid size={{ xs: 12, md: permissions.canViewInternalSections ? 6 : 12 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <HandshakeIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Sovitut laskutusperiaatteet
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#2C2B35', lineHeight: 1.8 }}>
                {customer.billing.agreedPrinciples}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Internal Billing Instructions - Only visible to Integrata users */}
        {permissions.canViewInternalSections && customer.billing.internalInstructions && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                backgroundColor: '#FFF8E1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: '1px solid #FFE082',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <LockIcon sx={{ color: '#F57C00' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    Sisäiset laskutusohjeet
                  </Typography>
                  <Chip
                    label="Vain IG"
                    size="small"
                    sx={{
                      backgroundColor: '#F57C00',
                      color: '#FFF',
                      fontSize: '0.7rem',
                      height: 22,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    '& .MuiAlert-icon': { color: '#F57C00' }
                  }}
                >
                  Nämä tiedot näkyvät vain Integratan käyttäjille
                </Alert>
                <Typography variant="body2" sx={{ color: '#2C2B35', lineHeight: 1.8 }}>
                  {customer.billing.internalInstructions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
