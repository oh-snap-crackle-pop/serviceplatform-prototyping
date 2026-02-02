import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { BenefitCard } from './BenefitCard';
import { standardBenefits, categoryLabels } from '../../data/mockData';
import type { BenefitCategory, BenefitStatus } from '../../types/benefits';

export const StandardBenefits: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BenefitCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BenefitStatus | 'all'>('all');

  const categories = [...new Set(standardBenefits.map((b) => b.category))];

  const filteredBenefits = standardBenefits.filter((benefit) => {
    const matchesSearch =
      benefit.name.fi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || benefit.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || benefit.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeBenefitsCount = standardBenefits.filter((b) => b.status === 'active').length;

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
          Vakioedut
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Vakioedut
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Työnantajasi tarjoamat vakioedut
          </Typography>
        </Box>
        <Chip
          label={`${activeBenefitsCount} aktiivista etua`}
          color="success"
          variant="outlined"
        />
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
            <MenuItem value="upcoming">Tulossa</MenuItem>
            <MenuItem value="expired">Päättynyt</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Benefits grid */}
      <Grid container spacing={3}>
        {filteredBenefits.map((benefit) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={benefit.id}>
            <BenefitCard benefit={benefit} />
          </Grid>
        ))}
      </Grid>

      {filteredBenefits.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">Ei tuloksia</Typography>
          <Typography variant="body2">Kokeile muuttaa hakuehtoja</Typography>
        </Box>
      )}
    </Box>
  );
};
