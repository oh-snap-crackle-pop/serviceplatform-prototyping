import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface CollaborationSectionProps {
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

export const CollaborationSection: React.FC<CollaborationSectionProps> = ({
  customer,
  permissions,
}) => {
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
        {/* Customer Contacts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <PeopleIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Asiakkaan yhteyshenkilöt
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customer.contacts.map((contact) => (
                  <Box key={contact.id} sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: contact.avatarColor, width: 44, height: 44 }}>
                      {contact.initials}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#2C2B35' }}>
                          {contact.name}
                        </Typography>
                        <Chip
                          label={contact.stakeholderType}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor: '#E8E8E8',
                            color: '#2C2B35',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {contact.role}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14, color: '#999' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {contact.email}
                          </Typography>
                        </Box>
                        {contact.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: '#999' }} />
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {contact.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {contact.systemAccess.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                          {contact.systemAccess.map((access, idx) => (
                            <Chip
                              key={idx}
                              label={`${access.systemName}: ${access.accessLevel}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                borderColor: '#BDBDBD',
                                color: '#666',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrata Specialists */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <SendIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Integratan asiantuntijat
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customer.specialists
                  .filter((s) => permissions.canViewInternalSections || !s.isInternalOnly)
                  .map((specialist) => (
                    <Box key={specialist.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          bgcolor: specialist.avatarColor,
                          width: 44,
                          height: 44,
                          border: '2px solid #E53935',
                        }}
                      >
                        {specialist.initials}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 600, color: '#2C2B35' }}>
                            {specialist.name}
                          </Typography>
                          {specialist.isInternalOnly && (
                            <Chip
                              icon={<LockIcon sx={{ fontSize: 12 }} />}
                              label="Sisäinen"
                              size="small"
                              color="warning"
                              sx={{ fontSize: '0.65rem', height: 18 }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {specialist.roleLabel}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          {specialist.email}
                        </Typography>
                        {specialist.phone && (
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {specialist.phone}
                          </Typography>
                        )}
                      </Box>
                      <IconButton size="small" sx={{ color: '#E53935' }}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee Count & Customer Service Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#F8F8F8', borderRadius: 2, mb: 2 }}>
                <PeopleIcon sx={{ color: '#E53935', fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#E53935', lineHeight: 1 }}>
                    {customer.employeeCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                    Henkilömäärä
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2C2B35', mb: 1 }}>
                Asiakaspalvelun sähköposti
              </Typography>
              <Link href={`mailto:${customer.customerServiceEmail}`} sx={{ color: '#E53935', fontWeight: 500 }}>
                {customer.customerServiceEmail}
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Trust Representatives */}
        {customer.trustRepresentatives.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={cardStyles}>
              <CardContent>
                <Box sx={sectionHeaderStyles}>
                  <PeopleIcon sx={{ color: '#E53935' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                    Luottamushenkilöt ja työsuojeluvaltuutetut
                  </Typography>
                </Box>
                <List disablePadding>
                  {customer.trustRepresentatives.map((rep) => (
                    <ListItem key={rep.id} disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <PeopleIcon sx={{ color: '#E53935' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={rep.name}
                        secondary={
                          <>
                            {rep.role === 'luottamusmies' ? 'Luottamusmies' : 'Työsuojeluvaltuutettu'}
                            {rep.area && ` - ${rep.area}`}
                            <br />
                            {rep.email}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 500, color: '#2C2B35' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Meeting Minutes */}
        <Grid size={{ xs: 12 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <DescriptionIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Yhteistyöpalavereiden muistiot
                </Typography>
              </Box>
              <List disablePadding>
                {customer.meetingMinutes.map((meeting, index) => (
                  <React.Fragment key={meeting.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <DescriptionIcon sx={{ color: '#E53935' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={meeting.documentUrl} sx={{ color: '#2C2B35', fontWeight: 500 }}>
                            {meeting.title}
                          </Link>
                        }
                        secondary={
                          <>
                            {formatDate(meeting.date)} - Osallistujat: {meeting.participants.join(', ')}
                            <br />
                            Aiheet: {meeting.topics.join(', ')}
                          </>
                        }
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    {index < customer.meetingMinutes.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
