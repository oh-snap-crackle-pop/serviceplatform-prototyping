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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected
          ? '0 8px 32px rgba(229, 57, 53, 0.25)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        '&:hover': selectable
          ? {
              borderColor: 'primary.main',
              transform: 'translateY(-6px)',
              boxShadow: '0 12px 40px rgba(229, 57, 53, 0.2)',
            }
          : {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
        '&::before': selected ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #E53935 0%, #FF6F60 100%)',
        } : {},
      }}
      onClick={selectable ? onSelect : undefined}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                background: selected
                  ? 'linear-gradient(135deg, #E53935 0%, #FF6F60 100%)'
                  : 'linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(255, 111, 96, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selected ? '#fff' : 'primary.main',
                boxShadow: selected ? '0 4px 14px rgba(229, 57, 53, 0.4)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {Icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
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
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                  },
                }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 40, lineHeight: 1.6 }}>
          {benefit.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            p: 2,
            mx: -1,
            borderRadius: 2,
            backgroundColor: 'action.hover',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Arvo
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatValue()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Voimassa
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatDateRange()}</Typography>
          </Box>
        </Box>

        {selected && (
          <Box
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(255, 111, 96, 0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Valittu etu
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
