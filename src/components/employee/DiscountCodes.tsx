import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Avatar,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import { CopyableCode } from '../common/CopyableCode';
import { discountCodes, categoryLabels } from '../../data/mockData';

// Card gradient colors based on index
const cardGradients = [
  'linear-gradient(135deg, #E53935 0%, #FF6F60 100%)',
  'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
  'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
  'linear-gradient(135deg, #FB8C00 0%, #FFA726 100%)',
  'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
  'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
];

export const DiscountCodes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get unique categories from all discount codes
  const allCategories = [...new Set(discountCodes.flatMap((d) => d.category))];

  const filteredCodes = discountCodes.filter((code) => {
    const matchesSearch =
      code.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || code.category.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  const isExpiringSoon = (validTo: string) => {
    const expiryDate = new Date(validTo);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
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
          Alennuskoodit
        </Typography>
      </Breadcrumbs>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FB8C00 0%, #FFA726 100%)',
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
              <LocalOfferIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                Alennuskoodit
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                Kumppaneiden tarjoamat alennukset työntekijöille
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<PercentIcon />}
            label={`${discountCodes.length} alennuskoodia`}
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

      {/* Filters */}
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
          placeholder="Hae kumppania tai koodia..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 300,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">Kaikki</MenuItem>
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoryLabels[cat] || cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Discount codes grid */}
      <Grid container spacing={3}>
        {filteredCodes.map((discount, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={discount.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}
            >
              {/* Gradient header */}
              <Box
                sx={{
                  background: cardGradients[index % cardGradients.length],
                  p: 2.5,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={discount.partnerLogo}
                    alt={discount.partnerName}
                    sx={{
                      width: 56,
                      height: 56,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                    }}
                  >
                    {discount.partnerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                      {discount.partnerName}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >
                      {discount.discountAmount}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {discount.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2.5 }}>
                  {discount.category.map((cat) => (
                    <Chip
                      key={cat}
                      label={categoryLabels[cat] || cat}
                      size="small"
                      sx={{
                        backgroundColor: 'action.hover',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    mb: 2.5,
                    p: 2,
                    backgroundColor: 'action.hover',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Alennuskoodi
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <CopyableCode code={discount.code} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Voimassa
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {formatDate(discount.validFrom)} - {formatDate(discount.validTo)}
                  </Typography>
                  {isExpiringSoon(discount.validTo) && (
                    <Chip
                      label="Päättyy pian"
                      size="small"
                      color="warning"
                      sx={{ mt: 1, fontWeight: 600 }}
                    />
                  )}
                </Box>
              </CardContent>
              <Box sx={{ p: 2.5, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<OpenInNewIcon />}
                  href={discount.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: cardGradients[index % cardGradients.length],
                    '&:hover': {
                      background: cardGradients[index % cardGradients.length],
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Siirry kumppanin sivuille
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCodes.length === 0 && (
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
