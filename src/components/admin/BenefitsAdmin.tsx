import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { BenefitForm } from './BenefitForm';
import { standardBenefits as initialBenefits, categoryLabels, unitLabels } from '../../data/mockData';
import type { Benefit, BenefitCategory, BenefitStatus } from '../../types/benefits';

export const BenefitsAdmin: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BenefitCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BenefitStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuBenefitId, setMenuBenefitId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const categories = [...new Set(benefits.map((b) => b.category))];

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.name.fi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || benefit.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || benefit.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBenefits.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleCreateBenefit = () => {
    setEditingBenefit(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setEditingBenefit(benefit);
    setFormMode('edit');
    setFormOpen(true);
    setAnchorEl(null);
  };

  const handleSaveBenefit = (benefitData: Partial<Benefit>) => {
    if (formMode === 'create') {
      setBenefits((prev) => [...prev, benefitData as Benefit]);
      setSnackbar({ open: true, message: 'Etu lisätty onnistuneesti', severity: 'success' });
    } else {
      setBenefits((prev) =>
        prev.map((b) => (b.id === benefitData.id ? { ...b, ...benefitData } : b))
      );
      setSnackbar({ open: true, message: 'Etu päivitetty onnistuneesti', severity: 'success' });
    }
  };

  const handleDeleteBenefit = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setBenefits((prev) => prev.filter((b) => b.id !== deletingId));
      setSnackbar({ open: true, message: 'Etu poistettu', severity: 'success' });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleDuplicateBenefit = (benefit: Benefit) => {
    const newBenefit: Benefit = {
      ...benefit,
      id: `benefit-${Date.now()}`,
      name: {
        ...benefit.name,
        fi: `${benefit.name.fi} (kopio)`,
      },
      status: 'draft',
    };
    setBenefits((prev) => [...prev, newBenefit]);
    setSnackbar({ open: true, message: 'Etu kopioitu', severity: 'success' });
    setAnchorEl(null);
  };

  const handleBulkArchive = () => {
    setBenefits((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, status: 'archived' as BenefitStatus } : b))
    );
    setSelectedIds([]);
    setSnackbar({ open: true, message: `${selectedIds.length} etua arkistoitu`, severity: 'success' });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, benefitId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuBenefitId(benefitId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBenefitId(null);
  };

  const formatValue = (benefit: Benefit) => {
    return `${benefit.value.amount.toLocaleString('fi-FI')} €${unitLabels[benefit.value.unit] || ''}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Vakioetujen hallinta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hallinnoi työnantajan tarjoamia vakioetuja
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateBenefit}>
          Lisää uusi etu
        </Button>
      </Box>

      {/* Filters and bulk actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Hae etua..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={categoryFilter}
            label="Kategoria"
            onChange={(e) => setCategoryFilter(e.target.value as BenefitCategory | 'all')}
          >
            <MenuItem value="all">Kaikki</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoryLabels[cat] || cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tila</InputLabel>
          <Select
            value={statusFilter}
            label="Tila"
            onChange={(e) => setStatusFilter(e.target.value as BenefitStatus | 'all')}
          >
            <MenuItem value="all">Kaikki</MenuItem>
            <MenuItem value="active">Aktiivinen</MenuItem>
            <MenuItem value="draft">Luonnos</MenuItem>
            <MenuItem value="archived">Arkistoitu</MenuItem>
          </Select>
        </FormControl>

        {selectedIds.length > 0 && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              label={`${selectedIds.length} valittu`}
              onDelete={() => setSelectedIds([])}
            />
            <Button
              size="small"
              startIcon={<ArchiveIcon />}
              onClick={handleBulkArchive}
            >
              Arkistoi valitut
            </Button>
          </>
        )}
      </Box>

      {/* Benefits table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === filteredBenefits.length && filteredBenefits.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredBenefits.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Nimi</TableCell>
              <TableCell>Kategoria</TableCell>
              <TableCell>Arvo</TableCell>
              <TableCell>Tila</TableCell>
              <TableCell align="right">Toiminnot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBenefits.map((benefit) => (
              <TableRow
                key={benefit.id}
                hover
                selected={selectedIds.includes(benefit.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(benefit.id)}
                    onChange={(e) => handleSelectOne(benefit.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {benefit.name.fi}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {benefit.description.substring(0, 60)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={categoryLabels[benefit.category] || benefit.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatValue(benefit)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={benefit.status} />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Muokkaa">
                    <IconButton size="small" onClick={() => handleEditBenefit(benefit)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, benefit.id)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredBenefits.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Ei etuja
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lisää ensimmäinen etu painamalla "Lisää uusi etu" -painiketta
          </Typography>
        </Box>
      )}

      {/* Actions menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            const benefit = benefits.find((b) => b.id === menuBenefitId);
            if (benefit) handleEditBenefit(benefit);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Muokkaa</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const benefit = benefits.find((b) => b.id === menuBenefitId);
            if (benefit) handleDuplicateBenefit(benefit);
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Kopioi</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Esikatsele työntekijänä</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuBenefitId) handleDeleteBenefit(menuBenefitId);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Poista</ListItemText>
        </MenuItem>
      </Menu>

      {/* Form dialog */}
      <BenefitForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveBenefit}
        benefit={editingBenefit}
        mode={formMode}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Poista etu"
        message="Haluatko varmasti poistaa tämän edun? Toimintoa ei voi perua."
        confirmLabel="Poista"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
