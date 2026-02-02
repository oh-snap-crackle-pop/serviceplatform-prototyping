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
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FolderIcon from '@mui/icons-material/Folder';
import BuildIcon from '@mui/icons-material/Build';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import type { Customer, UserPermissions, QuickLink } from '../../../data/customerMockData';

interface LinksSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system':
      return <ComputerIcon sx={{ color: '#E53935' }} />;
    case 'analytics':
      return <AnalyticsIcon sx={{ color: '#4CAF50' }} />;
    case 'documents':
      return <FolderIcon sx={{ color: '#FF9800' }} />;
    case 'internal':
      return <BuildIcon sx={{ color: '#9C27B0' }} />;
    default:
      return <ComputerIcon sx={{ color: '#666' }} />;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'system':
      return 'Järjestelmät';
    case 'analytics':
      return 'Analytiikka';
    case 'documents':
      return 'Dokumentit';
    case 'internal':
      return 'Sisäinen';
    default:
      return category;
  }
};

// Shared card styles for consistency
const cardStyles = {
  backgroundColor: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderRadius: 2,
  height: '100%',
};

const internalCardStyles = {
  backgroundColor: '#FFF8E1',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #FFE082',
  borderRadius: 2,
  height: '100%',
};

const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2.5,
};

const LinkCard: React.FC<{ links: QuickLink[]; category: string; isInternal: boolean }> = ({
  links,
  category,
  isInternal,
}) => (
  <Card sx={isInternal ? internalCardStyles : cardStyles}>
    <CardContent>
      <Box sx={sectionHeaderStyles}>
        {getCategoryIcon(category)}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
          {getCategoryLabel(category)}
        </Typography>
        {isInternal && (
          <Chip
            icon={<LockIcon sx={{ fontSize: 12 }} />}
            label="Vain IG"
            size="small"
            sx={{
              backgroundColor: '#F57C00',
              color: '#FFF',
              fontSize: '0.7rem',
              height: 22,
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#FFF' },
            }}
          />
        )}
      </Box>
      <List disablePadding>
        {links.map((link) => (
          <ListItem key={link.id} disablePadding sx={{ py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <OpenInNewIcon sx={{ fontSize: 18, color: '#999' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#2C2B35',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#E53935',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.label}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export const LinksSection: React.FC<LinksSectionProps> = ({ customer, permissions }) => {
  // Filter links based on permissions
  const visibleLinks = customer.quickLinks.filter(
    (link) => permissions.canViewInternalSections || !link.isInternalOnly
  );

  // Group links by category
  const systemLinks = visibleLinks.filter((l) => l.category === 'system');
  const analyticsLinks = visibleLinks.filter((l) => l.category === 'analytics');
  const documentLinks = visibleLinks.filter((l) => l.category === 'documents');
  const internalLinks = visibleLinks.filter((l) => l.category === 'internal');

  return (
    <Box>
      <Grid container spacing={3}>
        {/* System Links */}
        {systemLinks.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <LinkCard links={systemLinks} category="system" isInternal={false} />
          </Grid>
        )}

        {/* Analytics Links */}
        {analyticsLinks.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <LinkCard links={analyticsLinks} category="analytics" isInternal={false} />
          </Grid>
        )}

        {/* Document Links - Internal only */}
        {documentLinks.length > 0 && permissions.canViewInternalSections && (
          <Grid size={{ xs: 12, md: 6 }}>
            <LinkCard links={documentLinks} category="documents" isInternal={true} />
          </Grid>
        )}

        {/* Internal Links - Internal only */}
        {internalLinks.length > 0 && permissions.canViewInternalSections && (
          <Grid size={{ xs: 12, md: 6 }}>
            <LinkCard links={internalLinks} category="internal" isInternal={true} />
          </Grid>
        )}
      </Grid>

      {visibleLinks.length === 0 && (
        <Card sx={cardStyles}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ComputerIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#666' }}>
              Ei linkkejä saatavilla.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
