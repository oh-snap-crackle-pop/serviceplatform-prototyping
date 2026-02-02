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
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface ScheduleSectionProps {
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

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ customer }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fi-FI', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <FlagIcon sx={{ color: '#F44336' }} />;
      case 'meeting':
        return <MeetingRoomIcon sx={{ color: '#2196F3' }} />;
      case 'reporting':
        return <AssignmentIcon sx={{ color: '#FF9800' }} />;
      case 'payment':
        return <EventIcon sx={{ color: '#4CAF50' }} />;
      default:
        return <CalendarMonthIcon sx={{ color: '#9C27B0' }} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'error';
      case 'meeting':
        return 'info';
      case 'reporting':
        return 'warning';
      case 'payment':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Tulossa';
      case 'in_progress':
        return 'Käynnissä';
      case 'completed':
        return 'Valmis';
      default:
        return status;
    }
  };

  // Sort tasks by due date
  const sortedTasks = [...customer.upcomingTasks].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );

  // Sort calendar events by date
  const sortedEvents = [...customer.annualCalendar].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Group events by month
  const eventsByMonth = sortedEvents.reduce((acc, event) => {
    const month = event.date.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, typeof sortedEvents>);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Upcoming Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <AssignmentIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Seuraavat tulevat tehtävät
                </Typography>
              </Box>
              <List disablePadding>
                {sortedTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <AssignmentIcon sx={{ color: '#E53935' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 500, color: '#2C2B35' }}>
                              {task.name}
                            </Typography>
                            <Chip
                              label={getStatusLabel(task.status)}
                              size="small"
                              color={getStatusColor(task.status) as 'primary' | 'warning' | 'success' | 'default'}
                              sx={{ fontSize: '0.65rem', height: 18 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" sx={{ color: '#E53935', fontWeight: 500 }}>
                              {formatDate(task.dueDate)}
                            </Typography>
                            {task.responsible && (
                              <Typography component="span" variant="body2" sx={{ color: '#666' }}>
                                {' '}- {task.responsible}
                              </Typography>
                            )}
                            <br />
                            <Chip
                              label={task.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.65rem',
                                height: 18,
                                mt: 0.5,
                                borderColor: '#BDBDBD',
                                color: '#666',
                              }}
                            />
                          </>
                        }
                      />
                    </ListItem>
                    {index < sortedTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Annual Calendar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CalendarMonthIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Vuosikello
                </Typography>
              </Box>
              {Object.entries(eventsByMonth).map(([month, events]) => (
                <Box key={month} sx={{ mb: 2.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#2C2B35',
                      textTransform: 'capitalize',
                      mb: 1.5,
                      pb: 0.75,
                      borderBottom: '2px solid #E53935',
                      display: 'inline-block',
                    }}
                  >
                    {month}
                  </Typography>
                  <List disablePadding dense>
                    {events.map((event) => (
                      <ListItem key={event.id} disablePadding sx={{ py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getEventIcon(event.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={event.name}
                          secondary={event.date.toLocaleDateString('fi-FI', {
                            day: 'numeric',
                            month: 'numeric',
                          })}
                          primaryTypographyProps={{ fontWeight: 500, color: '#2C2B35', fontSize: '0.9rem' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={event.type === 'deadline' ? 'Deadline' : event.type === 'meeting' ? 'Palaveri' : 'Muu'}
                          size="small"
                          color={getEventColor(event.type) as 'error' | 'info' | 'warning' | 'success' | 'default'}
                          sx={{ fontSize: '0.65rem', height: 18 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
