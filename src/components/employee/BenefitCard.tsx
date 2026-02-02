import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SpaIcon from '@mui/icons-material/Spa';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChairIcon from '@mui/icons-material/Chair';
import WifiIcon from '@mui/icons-material/Wifi';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import type { Benefit } from '../../types/benefits';
import { StatusBadge } from '../common/StatusBadge';
import { unitLabels } from '../../data/mockData';

const iconMap: Record<string, React.ReactNode> = {
  Restaurant: <RestaurantIcon />,
  FitnessCenter: <FitnessCenterIcon />,
  TheaterComedy: <TheaterComedyIcon />,
  DirectionsBus: <DirectionsBusIcon />,
  PhoneAndroid: <PhoneAndroidIcon />,
  Shield: <ShieldIcon />,
  LocalHospital: <LocalHospitalIcon />,
  MedicalServices: <MedicalServicesIcon />,
  Spa: <SpaIcon />,
  ChildCare: <ChildCareIcon />,
  CleaningServices: <CleaningServicesIcon />,
  Chair: <ChairIcon />,
  Wifi: <WifiIcon />,
};

interface BenefitCardProps {
  benefit: Benefit;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  benefit,
  selected = false,
  selectable = false,
  onSelect,
}) => {
  const Icon = benefit.icon && iconMap[benefit.icon] ? iconMap[benefit.icon] : <CardGiftcardIcon />;

  const formatValue = () => {
    const { amount, unit } = benefit.value;
    return `${amount.toLocaleString('fi-FI')} €${unitLabels[unit] || ''}`;
  };

  const formatDateRange = () => {
    const from = new Date(benefit.validFrom).toLocaleDateString('fi-FI');
    const to = benefit.validTo ? new Date(benefit.validTo).toLocaleDateString('fi-FI') : 'toistaiseksi';
    return `${from} - ${to}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: selectable ? 'pointer' : 'default',
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': selectable
          ? {
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
            }
          : {},
      }}
      onClick={selectable ? onSelect : undefined}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: selected ? 'primary.main' : 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selected ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {Icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {benefit.name.fi}
              </Typography>
              <StatusBadge status={benefit.status} />
            </Box>
          </Box>
          {benefit.externalLink && (
            <Tooltip title="Avaa ulkoinen linkki">
              <IconButton
                size="small"
                component={Link}
                href={benefit.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {benefit.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Arvo
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {formatValue()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Voimassa
            </Typography>
            <Typography variant="body2">{formatDateRange()}</Typography>
          </Box>
        </Box>

        {selected && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Valittu etu
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
