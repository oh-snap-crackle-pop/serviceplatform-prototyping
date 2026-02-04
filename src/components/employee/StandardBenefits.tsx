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
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
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

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
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
              <CardGiftcardIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                Vakioedut
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                Työnantajasi tarjoamat vakioedut
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<CheckCircleOutlineIcon />}
            label={`${activeBenefitsCount} aktiivista etua`}
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

      {/* Filters with enhanced styling */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          placeholder="Hae etua..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
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
            sx={{ borderRadius: 2 }}
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
            sx={{ borderRadius: 2 }}
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
