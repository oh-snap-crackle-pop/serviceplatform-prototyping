import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { optionalBenefitGroups as initialGroups, unitLabels } from '../../data/mockData';
import type { OptionalBenefitGroup, Benefit, ValueUnit } from '../../types/benefits';

const units: ValueUnit[] = ['day', 'month', 'year', 'one-time'];

export const OptionalBenefitsAdmin: React.FC = () => {
  const [groups, setGroups] = useState<OptionalBenefitGroup[]>(initialGroups);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [optionFormOpen, setOptionFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OptionalBenefitGroup | null>(null);
  const [editingOption, setEditingOption] = useState<{ groupId: string; option: Benefit | null }>({
    groupId: '',
    option: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'group' | 'option';
    groupId: string;
    optionId?: string;
  }>({ open: false, type: 'group', groupId: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Group form state
  const [groupForm, setGroupForm] = useState({
    nameFi: '',
    nameEn: '',
    nameSv: '',
    description: '',
    selectionStart: '',
    selectionEnd: '',
    changeRestrictions: '',
  });

  // Option form state
  const [optionForm, setOptionForm] = useState({
    nameFi: '',
    nameEn: '',
    nameSv: '',
    description: '',
    amount: 0,
    unit: 'month' as ValueUnit,
    icon: '',
  });

  const handleOpenGroupForm = (group?: OptionalBenefitGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupForm({
        nameFi: group.name.fi,
        nameEn: group.name.en,
        nameSv: group.name.sv,
        description: group.description,
        selectionStart: group.selectionPeriod.start,
        selectionEnd: group.selectionPeriod.end,
        changeRestrictions: group.changeRestrictions,
      });
    } else {
      setEditingGroup(null);
      setGroupForm({
        nameFi: '',
        nameEn: '',
        nameSv: '',
        description: '',
        selectionStart: '',
        selectionEnd: '',
        changeRestrictions: '',
      });
    }
    setGroupFormOpen(true);
  };

  const handleSaveGroup = () => {
    const groupData: OptionalBenefitGroup = {
      id: editingGroup?.id || `group-${Date.now()}`,
      name: { fi: groupForm.nameFi, en: groupForm.nameEn, sv: groupForm.nameSv },
      description: groupForm.description,
      options: editingGroup?.options || [],
      selectionPeriod: { start: groupForm.selectionStart, end: groupForm.selectionEnd },
      changeRestrictions: groupForm.changeRestrictions,
    };

    if (editingGroup) {
      setGroups((prev) => prev.map((g) => (g.id === groupData.id ? groupData : g)));
      setSnackbar({ open: true, message: 'Eturyhmä päivitetty', severity: 'success' });
    } else {
      setGroups((prev) => [...prev, groupData]);
      setSnackbar({ open: true, message: 'Eturyhmä lisätty', severity: 'success' });
    }
    setGroupFormOpen(false);
  };

  const handleOpenOptionForm = (groupId: string, option?: Benefit) => {
    setEditingOption({ groupId, option: option || null });
    if (option) {
      setOptionForm({
        nameFi: option.name.fi,
        nameEn: option.name.en,
        nameSv: option.name.sv,
        description: option.description,
        amount: option.value.amount,
        unit: option.value.unit,
        icon: option.icon || '',
      });
    } else {
      setOptionForm({
        nameFi: '',
        nameEn: '',
        nameSv: '',
        description: '',
        amount: 0,
        unit: 'month',
        icon: '',
      });
    }
    setOptionFormOpen(true);
  };

  const handleSaveOption = () => {
    const optionData: Benefit = {
      id: editingOption.option?.id || `opt-${Date.now()}`,
      type: 'optional',
      name: { fi: optionForm.nameFi, en: optionForm.nameEn, sv: optionForm.nameSv },
      description: optionForm.description,
      category: 'wellbeing',
      value: { amount: optionForm.amount, unit: optionForm.unit, currency: 'EUR' },
      status: 'active',
      validFrom: new Date().toISOString().split('T')[0],
      icon: optionForm.icon || undefined,
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === editingOption.groupId) {
          if (editingOption.option) {
            return {
              ...g,
              options: g.options.map((o) => (o.id === optionData.id ? optionData : o)),
            };
          } else {
            return { ...g, options: [...g.options, optionData] };
          }
        }
        return g;
      })
    );

    setSnackbar({
      open: true,
      message: editingOption.option ? 'Vaihtoehto päivitetty' : 'Vaihtoehto lisätty',
      severity: 'success',
    });
    setOptionFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteDialog.type === 'group') {
      setGroups((prev) => prev.filter((g) => g.id !== deleteDialog.groupId));
      setSnackbar({ open: true, message: 'Eturyhmä poistettu', severity: 'success' });
    } else if (deleteDialog.optionId) {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === deleteDialog.groupId) {
            return { ...g, options: g.options.filter((o) => o.id !== deleteDialog.optionId) };
          }
          return g;
        })
      );
      setSnackbar({ open: true, message: 'Vaihtoehto poistettu', severity: 'success' });
    }
    setDeleteDialog({ open: false, type: 'group', groupId: '' });
  };

  const formatValue = (option: Benefit) => {
    return `${option.value.amount.toLocaleString('fi-FI')} €${unitLabels[option.value.unit] || ''}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Valinnaisten etujen hallinta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hallinnoi valinnaisia eturyhmiä ja niiden vaihtoehtoja
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenGroupForm()}>
          Lisää uusi eturyhmä
        </Button>
      </Box>

      {groups.map((group) => (
        <Accordion key={group.id} defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {group.name.fi}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(group.selectionPeriod.start)} - {formatDate(group.selectionPeriod.end)}
                    </Typography>
                  </Box>
                  <Chip label={`${group.options.length} vaihtoehtoa`} size="small" />
                </Box>
              </Box>
              <Tooltip title="Muokkaa ryhmää">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenGroupForm(group);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Poista ryhmä">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ open: true, type: 'group', groupId: group.id });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {group.description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              {group.changeRestrictions}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {group.options.map((option) => (
                <Grid size={{ xs: 12, md: 4 }} key={option.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {option.name.fi}
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            {formatValue(option)}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenOptionForm(group.id, option)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: 'option',
                                groupId: group.id,
                                optionId: option.id,
                              })
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {option.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderStyle: 'dashed',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  onClick={() => handleOpenOptionForm(group.id)}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <AddIcon color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Lisää vaihtoehto
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {groups.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Ei eturyhmiä
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Lisää ensimmäinen eturyhmä aloittaaksesi
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenGroupForm()}>
            Lisää eturyhmä
          </Button>
        </Card>
      )}

      {/* Group form dialog */}
      <Dialog open={groupFormOpen} onClose={() => setGroupFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGroup ? 'Muokkaa eturyhmää' : 'Lisää uusi eturyhmä'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nimi (suomi)"
                  value={groupForm.nameFi}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, nameFi: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Nimi (englanti)"
                  value={groupForm.nameEn}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Nimi (ruotsi)"
                  value={groupForm.nameSv}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, nameSv: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kuvaus"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Valinta-aika alkaa"
                  type="date"
                  value={groupForm.selectionStart}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, selectionStart: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Valinta-aika päättyy"
                  type="date"
                  value={groupForm.selectionEnd}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, selectionEnd: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Vaihdon rajoitukset"
                  value={groupForm.changeRestrictions}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, changeRestrictions: e.target.value }))}
                  placeholder="esim. Valinnan voi muuttaa kerran vuodessa marraskuussa."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGroupFormOpen(false)} color="inherit">
            Peruuta
          </Button>
          <Button onClick={handleSaveGroup} variant="contained" disabled={!groupForm.nameFi}>
            {editingGroup ? 'Tallenna' : 'Lisää'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Option form dialog */}
      <Dialog open={optionFormOpen} onClose={() => setOptionFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOption.option ? 'Muokkaa vaihtoehtoa' : 'Lisää uusi vaihtoehto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nimi (suomi)"
                  value={optionForm.nameFi}
                  onChange={(e) => setOptionForm((prev) => ({ ...prev, nameFi: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Nimi (englanti)"
                  value={optionForm.nameEn}
                  onChange={(e) => setOptionForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Nimi (ruotsi)"
                  value={optionForm.nameSv}
                  onChange={(e) => setOptionForm((prev) => ({ ...prev, nameSv: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kuvaus"
                  value={optionForm.description}
                  onChange={(e) => setOptionForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Arvo"
                  type="number"
                  value={optionForm.amount}
                  onChange={(e) =>
                    setOptionForm((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
                  }
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Yksikkö</InputLabel>
                  <Select
                    value={optionForm.unit}
                    label="Yksikkö"
                    onChange={(e) => setOptionForm((prev) => ({ ...prev, unit: e.target.value as ValueUnit }))}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit === 'day'
                          ? 'Per päivä'
                          : unit === 'month'
                          ? 'Per kuukausi'
                          : unit === 'year'
                          ? 'Per vuosi'
                          : 'Kertakorvaus'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOptionFormOpen(false)} color="inherit">
            Peruuta
          </Button>
          <Button onClick={handleSaveOption} variant="contained" disabled={!optionForm.nameFi}>
            {editingOption.option ? 'Tallenna' : 'Lisää'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.type === 'group' ? 'Poista eturyhmä' : 'Poista vaihtoehto'}
        message={
          deleteDialog.type === 'group'
            ? 'Haluatko varmasti poistaa tämän eturyhmän ja kaikki sen vaihtoehdot?'
            : 'Haluatko varmasti poistaa tämän vaihtoehdon?'
        }
        confirmLabel="Poista"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, type: 'group', groupId: '' })}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};
