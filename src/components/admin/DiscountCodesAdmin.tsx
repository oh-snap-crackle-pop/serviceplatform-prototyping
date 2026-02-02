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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { CopyableCode } from '../common/CopyableCode';
import { discountCodes as initialCodes, categoryLabels } from '../../data/mockData';
import type { DiscountCode } from '../../types/benefits';

export const DiscountCodesAdmin: React.FC = () => {
  const [codes, setCodes] = useState<DiscountCode[]>(initialCodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    partnerName: '',
    partnerLogo: '',
    description: '',
    code: '',
    discountAmount: '',
    category: '',
    validFrom: '',
    validTo: '',
    partnerUrl: '',
  });

  const filteredCodes = codes.filter(
    (code) =>
      code.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (code?: DiscountCode) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        partnerName: code.partnerName,
        partnerLogo: code.partnerLogo || '',
        description: code.description,
        code: code.code,
        discountAmount: code.discountAmount,
        category: code.category.join(', '),
        validFrom: code.validFrom,
        validTo: code.validTo,
        partnerUrl: code.partnerUrl,
      });
    } else {
      setEditingCode(null);
      setFormData({
        partnerName: '',
        partnerLogo: '',
        description: '',
        code: '',
        discountAmount: '',
        category: '',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        partnerUrl: '',
      });
    }
    setFormOpen(true);
  };

  const handleSave = () => {
    const codeData: DiscountCode = {
      id: editingCode?.id || `disc-${Date.now()}`,
      partnerName: formData.partnerName,
      partnerLogo: formData.partnerLogo || undefined,
      description: formData.description,
      code: formData.code,
      discountAmount: formData.discountAmount,
      category: formData.category.split(',').map((c) => c.trim()).filter(Boolean),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      partnerUrl: formData.partnerUrl,
    };

    if (editingCode) {
      setCodes((prev) => prev.map((c) => (c.id === codeData.id ? codeData : c)));
      setSnackbar({ open: true, message: 'Alennuskoodi päivitetty', severity: 'success' });
    } else {
      setCodes((prev) => [...prev, codeData]);
      setSnackbar({ open: true, message: 'Alennuskoodi lisätty', severity: 'success' });
    }
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setCodes((prev) => prev.filter((c) => c.id !== deletingId));
      setSnackbar({ open: true, message: 'Alennuskoodi poistettu', severity: 'success' });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date();
  };

  const isExpiringSoon = (validTo: string) => {
    const expiryDate = new Date(validTo);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isValid = formData.partnerName && formData.code && formData.discountAmount && formData.validFrom && formData.validTo;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Alennuskoodien hallinta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hallinnoi kumppaneiden tarjoamia alennuskoodeja
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Lisää uusi alennuskoodi
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Hae kumppania tai koodia..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kumppani</TableCell>
              <TableCell>Alennus</TableCell>
              <TableCell>Koodi</TableCell>
              <TableCell>Kategoriat</TableCell>
              <TableCell>Voimassaolo</TableCell>
              <TableCell align="right">Toiminnot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCodes.map((code) => (
              <TableRow
                key={code.id}
                hover
                sx={{ opacity: isExpired(code.validTo) ? 0.5 : 1 }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={code.partnerLogo}
                      sx={{ width: 36, height: 36, bgcolor: 'action.hover' }}
                    >
                      {code.partnerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {code.partnerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {code.description.substring(0, 40)}...
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {code.discountAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <CopyableCode code={code.code} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {code.category.slice(0, 2).map((cat) => (
                      <Chip
                        key={cat}
                        label={categoryLabels[cat] || cat}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {code.category.length > 2 && (
                      <Chip label={`+${code.category.length - 2}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(code.validFrom)} - {formatDate(code.validTo)}
                  </Typography>
                  {isExpired(code.validTo) && (
                    <Chip label="Päättynyt" size="small" color="error" sx={{ mt: 0.5 }} />
                  )}
                  {isExpiringSoon(code.validTo) && (
                    <Chip label="Päättyy pian" size="small" color="warning" sx={{ mt: 0.5 }} />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Avaa kumppanin sivu">
                    <IconButton
                      size="small"
                      href={code.partnerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Muokkaa">
                    <IconButton size="small" onClick={() => handleOpenForm(code)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Poista">
                    <IconButton size="small" onClick={() => handleDelete(code.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCodes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Ei alennuskoodeja
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lisää ensimmäinen alennuskoodi painamalla "Lisää uusi alennuskoodi" -painiketta
          </Typography>
        </Box>
      )}

      {/* Form dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCode ? 'Muokkaa alennuskoodia' : 'Lisää uusi alennuskoodi'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kumppanin nimi"
                  value={formData.partnerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, partnerName: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Logo URL (valinnainen)"
                  value={formData.partnerLogo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, partnerLogo: e.target.value }))}
                  placeholder="https://..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kuvaus"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Alennuskoodi"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Alennuksen määrä"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discountAmount: e.target.value }))}
                  placeholder="esim. 15% tai €10"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kategoriat (pilkulla erotettu)"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="esim. travel, accommodation"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Voimassa alkaen"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Voimassa asti"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, validTo: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Kumppanin verkkosivu"
                  value={formData.partnerUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, partnerUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)} color="inherit">
            Peruuta
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!isValid}>
            {editingCode ? 'Tallenna' : 'Lisää'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Poista alennuskoodi"
        message="Haluatko varmasti poistaa tämän alennuskoodin?"
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
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};
