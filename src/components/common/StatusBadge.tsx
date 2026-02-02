import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import type { BenefitStatus } from '../../types/benefits';

interface StatusBadgeProps {
  status: BenefitStatus;
  size?: ChipProps['size'];
}

const statusConfig: Record<BenefitStatus, { label: string; color: ChipProps['color'] }> = {
  active: { label: 'Aktiivinen', color: 'success' },
  draft: { label: 'Luonnos', color: 'default' },
  archived: { label: 'Arkistoitu', color: 'default' },
  upcoming: { label: 'Tulossa', color: 'info' },
  expired: { label: 'Päättynyt', color: 'default' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{
        fontWeight: 500,
        ...(status === 'archived' || status === 'expired'
          ? { opacity: 0.7 }
          : {}),
      }}
    />
  );
};
