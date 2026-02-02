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
import { CopyableCode } from '../common/CopyableCode';
import { discountCodes, categoryLabels } from '../../data/mockData';

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

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Alennuskoodit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kumppaneiden tarjoamat alennukset työntekijöille
          </Typography>
        </Box>
        <Chip
          label={`${discountCodes.length} alennuskoodia`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={categoryFilter}
            label="Kategoria"
            onChange={(e) => setCategoryFilter(e.target.value)}
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
        {filteredCodes.map((discount) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={discount.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Avatar
                    src={discount.partnerLogo}
                    alt={discount.partnerName}
                    sx={{
                      width: 56,
                      height: 56,
                      backgroundColor: 'action.hover',
                    }}
                  >
                    {discount.partnerName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {discount.partnerName}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: 'primary.main', fontWeight: 700 }}
                    >
                      {discount.discountAmount}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {discount.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {discount.category.map((cat) => (
                    <Chip
                      key={cat}
                      label={categoryLabels[cat] || cat}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Alennuskoodi
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <CopyableCode code={discount.code} />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Voimassa
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(discount.validFrom)} - {formatDate(discount.validTo)}
                    </Typography>
                    {isExpiringSoon(discount.validTo) && (
                      <Chip
                        label="Päättyy pian"
                        size="small"
                        color="warning"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<OpenInNewIcon />}
                  href={discount.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
