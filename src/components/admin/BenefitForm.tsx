import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import type { Benefit, BenefitCategory, BenefitStatus, ValueUnit } from '../../types/benefits';
import { categoryLabels } from '../../data/mockData';

interface BenefitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (benefit: Partial<Benefit>) => void;
  benefit?: Benefit | null;
  mode: 'create' | 'edit';
}

const categories: BenefitCategory[] = [
  'lunch',
  'sports',
  'culture',
  'commute',
  'phone',
  'insurance',
  'healthcare',
  'wellbeing',
  'other',
];

const statuses: BenefitStatus[] = ['active', 'draft', 'archived'];
const units: ValueUnit[] = ['day', 'month', 'year', 'one-time'];

export const BenefitForm: React.FC<BenefitFormProps> = ({
  open,
  onClose,
  onSave,
  benefit,
  mode,
}) => {
  const [formData, setFormData] = useState({
    nameFi: '',
    nameEn: '',
    nameSv: '',
    description: '',
    category: 'other' as BenefitCategory,
    amount: 0,
    unit: 'month' as ValueUnit,
    status: 'draft' as BenefitStatus,
    validFrom: '',
    validTo: '',
    externalLink: '',
    icon: '',
  });

  useEffect(() => {
    if (benefit) {
      setFormData({
        nameFi: benefit.name.fi,
        nameEn: benefit.name.en,
        nameSv: benefit.name.sv,
        description: benefit.description,
        category: benefit.category,
        amount: benefit.value.amount,
        unit: benefit.value.unit,
        status: benefit.status,
        validFrom: benefit.validFrom,
        validTo: benefit.validTo || '',
        externalLink: benefit.externalLink || '',
        icon: benefit.icon || '',
      });
    } else {
      setFormData({
        nameFi: '',
        nameEn: '',
        nameSv: '',
        description: '',
        category: 'other',
        amount: 0,
        unit: 'month',
        status: 'draft',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        externalLink: '',
        icon: '',
      });
    }
  }, [benefit, open]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const benefitData: Partial<Benefit> = {
      id: benefit?.id || `benefit-${Date.now()}`,
      type: 'standard',
      name: {
        fi: formData.nameFi,
        en: formData.nameEn,
        sv: formData.nameSv,
      },
      description: formData.description,
      category: formData.category,
      value: {
        amount: formData.amount,
        unit: formData.unit,
        currency: 'EUR',
      },
      status: formData.status,
      validFrom: formData.validFrom,
      validTo: formData.validTo || undefined,
      externalLink: formData.externalLink || undefined,
      icon: formData.icon || undefined,
    };

    onSave(benefitData);
    onClose();
  };

  const isValid = formData.nameFi && formData.description && formData.amount > 0 && formData.validFrom;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Lisää uusi etu' : 'Muokkaa etua'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Perustiedot
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Nimi (suomi)"
                value={formData.nameFi}
                onChange={(e) => handleChange('nameFi', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Nimi (englanti)"
                value={formData.nameEn}
                onChange={(e) => handleChange('nameEn', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Nimi (ruotsi)"
                value={formData.nameSv}
                onChange={(e) => handleChange('nameSv', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Kuvaus"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={formData.category}
                  label="Kategoria"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {categoryLabels[cat] || cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Tila</InputLabel>
                <Select
                  value={formData.status}
                  label="Tila"
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === 'active'
                        ? 'Aktiivinen'
                        : status === 'draft'
                        ? 'Luonnos'
                        : 'Arkistoitu'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Arvo ja voimassaolo
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Arvo"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Yksikkö</InputLabel>
                <Select
                  value={formData.unit}
                  label="Yksikkö"
                  onChange={(e) => handleChange('unit', e.target.value)}
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
            <Grid size={{ xs: 12, md: 4 }} />
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Voimassa alkaen"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleChange('validFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Voimassa asti (valinnainen)"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleChange('validTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Lisätiedot
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Ulkoinen linkki (valinnainen)"
                value={formData.externalLink}
                onChange={(e) => handleChange('externalLink', e.target.value)}
                placeholder="https://..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Ikoni (valinnainen)</InputLabel>
                <Select
                  value={formData.icon}
                  label="Ikoni (valinnainen)"
                  onChange={(e) => handleChange('icon', e.target.value)}
                >
                  <MenuItem value="">Ei ikonia</MenuItem>
                  <MenuItem value="Restaurant">Ravintola</MenuItem>
                  <MenuItem value="FitnessCenter">Liikunta</MenuItem>
                  <MenuItem value="TheaterComedy">Kulttuuri</MenuItem>
                  <MenuItem value="DirectionsBus">Julkinen liikenne</MenuItem>
                  <MenuItem value="PhoneAndroid">Puhelin</MenuItem>
                  <MenuItem value="Shield">Vakuutus</MenuItem>
                  <MenuItem value="MedicalServices">Terveys</MenuItem>
                  <MenuItem value="Spa">Hyvinvointi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Peruuta
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          {mode === 'create' ? 'Lisää etu' : 'Tallenna muutokset'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
