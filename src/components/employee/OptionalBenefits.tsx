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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Valinnaiset edut
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Valitse itsellesi sopivimmat edut kustakin ryhmästä
        </Typography>
      </Box>

      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 4 }}>
        Voit valita yhden edun jokaisesta eturyhmästä. Valinnat ovat voimassa kalenterivuoden ja
        niitä voi muuttaa kerran vuodessa valinta-aikana.
      </Alert>

      {optionalBenefitGroups.map((group) => {
        const currentSelection = getCurrentSelection(group.id);
        const selectionActive = isSelectionPeriodActive(
          group.selectionPeriod.start,
          group.selectionPeriod.end
        );

        return (
          <Card key={group.id} sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {group.name.fi}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {group.description}
                  </Typography>
                </Box>
                {selectionActive ? (
                  <Chip label="Valinta-aika käynnissä" color="success" />
                ) : (
                  <Chip label="Valinta-aika päättynyt" color="default" variant="outlined" />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon fontSize="small" color="action" />
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
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    Nykyinen valintasi tehty:{' '}
                    {new Date(currentSelection.selectedAt).toLocaleDateString('fi-FI')}
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
