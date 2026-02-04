import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BenefitCard } from './BenefitCard';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { optionalBenefitGroups, employeeSelections } from '../../data/mockData';

export const OptionalBenefits: React.FC = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState(employeeSelections);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    groupId: string;
    optionId: string;
    optionName: string;
  }>({
    open: false,
    groupId: '',
    optionId: '',
    optionName: '',
  });

  const isSelected = (groupId: string, optionId: string) => {
    return selections.some(
      (s) => s.groupId === groupId && s.selectedOptionId === optionId
    );
  };

  const getCurrentSelection = (groupId: string) => {
    return selections.find((s) => s.groupId === groupId);
  };

  const handleSelectOption = (groupId: string, optionId: string, optionName: string) => {
    const currentSelection = getCurrentSelection(groupId);
    if (currentSelection && currentSelection.selectedOptionId === optionId) {
      return; // Already selected
    }

    setConfirmDialog({
      open: true,
      groupId,
      optionId,
      optionName,
    });
  };

  const handleConfirmSelection = () => {
    const { groupId, optionId } = confirmDialog;

    setSelections((prev) => {
      const filtered = prev.filter((s) => s.groupId !== groupId);
      return [
        ...filtered,
        {
          employeeId: 'emp-1',
          groupId,
          selectedOptionId: optionId,
          selectedAt: new Date().toISOString(),
        },
      ];
    });

    setConfirmDialog({ open: false, groupId: '', optionId: '', optionName: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isSelectionPeriodActive = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/benefits')}
          sx={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          Henkilöstöedut
        </Link>
        <Typography variant="body2" color="text.primary">
          Valinnaiset edut
        </Typography>
      </Breadcrumbs>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: 80,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TuneIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                Valinnaiset edut
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                Valitse itsellesi sopivimmat edut kustakin ryhmästä
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${selections.length} valittua etua`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              py: 2.5,
              px: 1,
              '& .MuiChip-icon': { color: '#fff' },
            }}
          />
        </Box>
      </Box>

      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'info.light',
          '& .MuiAlert-icon': {
            color: 'info.main',
          },
        }}
      >
        Voit valita yhden edun jokaisesta eturyhmästä. Valinnat ovat voimassa kalenterivuoden ja
        niitä voi muuttaa kerran vuodessa valinta-aikana.
      </Alert>

      {optionalBenefitGroups.map((group, groupIndex) => {
        const currentSelection = getCurrentSelection(group.id);
        const selectionActive = isSelectionPeriodActive(
          group.selectionPeriod.start,
          group.selectionPeriod.end
        );

        const groupColors = [
          { gradient: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)', light: '#F3E5F5' },
          { gradient: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)', light: '#E0F2F1' },
        ];
        const colorScheme = groupColors[groupIndex % groupColors.length];

        return (
          <Card
            key={group.id}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Group header with gradient accent */}
            <Box sx={{ height: 6, background: colorScheme.gradient }} />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {group.name.fi}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {group.description}
                  </Typography>
                </Box>
                {selectionActive ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Valinta-aika käynnissä"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    icon={<AccessTimeIcon />}
                    label="Valinta-aika päättynyt"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  mb: 3,
                  flexWrap: 'wrap',
                  p: 2,
                  backgroundColor: colorScheme.light,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Valinta-aika: {formatDate(group.selectionPeriod.start)} -{' '}
                    {formatDate(group.selectionPeriod.end)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {group.changeRestrictions}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {group.options.map((option) => {
                  const selected = isSelected(group.id, option.id);
                  return (
                    <Grid size={{ xs: 12, md: 4 }} key={option.id}>
                      <BenefitCard
                        benefit={option}
                        selected={selected}
                        selectable={selectionActive}
                        onSelect={() => handleSelectOption(group.id, option.id, option.name.fi)}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {currentSelection && (
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    Nykyinen valintasi tehty:{' '}
                    <strong>{new Date(currentSelection.selectedAt).toLocaleDateString('fi-FI')}</strong>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}

      <ConfirmDialog
        open={confirmDialog.open}
        title="Vahvista valinta"
        message={`Haluatko varmasti valita edun "${confirmDialog.optionName}"? Tämä korvaa nykyisen valintasi tässä eturyhmässä.`}
        confirmLabel="Vahvista valinta"
        onConfirm={handleConfirmSelection}
        onCancel={() =>
          setConfirmDialog({ open: false, groupId: '', optionId: '', optionName: '' })
        }
      />
    </Box>
  );
};
