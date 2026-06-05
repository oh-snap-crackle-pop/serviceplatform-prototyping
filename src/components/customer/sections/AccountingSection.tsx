import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import SyncIcon from '@mui/icons-material/Sync';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import type { Customer, UserPermissions } from '../../../data/customerMockData';

interface AccountingSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

const cardStyles = {
  backgroundColor: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderRadius: 2,
  height: '100%',
};

const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2.5,
};

// ── Rich text editor ──────────────────────────────────────────────────────────

const RichTextEditor: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const execCmd = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          p: 0.5,
          mb: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: '#fafafa',
        }}
      >
        <Tooltip title="Lihavointi (Ctrl+B)">
          <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Kursivointi (Ctrl+I)">
          <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Alleviivaus (Ctrl+U)">
          <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Luettelo">
          <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numeroitu luettelo">
          <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }}>
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          minHeight: 200,
          border: `1px solid ${isFocused ? '#E53935' : '#e0e0e0'}`,
          borderRadius: 1,
          p: 1.5,
          fontSize: '0.875rem',
          lineHeight: 1.8,
          color: '#2C2B35',
          outline: 'none',
          cursor: 'text',
          transition: 'border-color 0.2s',
          '& ul, & ol': { pl: 2.5, my: 0.5 },
          '& p': { my: 0 },
          '& strong': { fontWeight: 600 },
        }}
      />
    </Box>
  );
};

// ── Main section ──────────────────────────────────────────────────────────────

export const AccountingSection: React.FC<AccountingSectionProps> = ({ customer }) => {
  const { accounting } = customer;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Top row: Aikataulu + Maksatus & verkkopalkat */}
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>

        {/* Aikataulu */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <CalendarTodayIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Aikataulu
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, textAlign: 'center', border: '1px solid #EEEEEE' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#E53935', lineHeight: 1 }}>
                      {accounting.reportingDate}.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Raportointipäivä (kuukauden)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, backgroundColor: '#F8F8F8', borderRadius: 2, textAlign: 'center', border: '1px solid #EEEEEE' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C2B35', lineHeight: 1.2 }}>
                      {accounting.fiscalYearStart.replace('-', '.')} – {accounting.fiscalYearEnd.replace('-', '.')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Tilikausi
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Maksatus & verkkopalkat */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={sectionHeaderStyles}>
                <PaymentIcon sx={{ color: '#E53935' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                  Maksatus & verkkopalkat
                </Typography>
              </Box>

              {/* Maksatus */}
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Maksatus
              </Typography>
              <Box sx={{ mt: 1, mb: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#2C2B35', minWidth: 170 }}>
                  Palvelualustan maksatus
                </Typography>
                <Tooltip title="Haetaan automaattisesti Palvelualustalta">
                  <Chip
                    icon={<SyncIcon sx={{ fontSize: '0.8rem !important' }} />}
                    label={accounting.platformPaymentEnabled ? 'Päällä' : 'Ei käytössä'}
                    size="small"
                    sx={{
                      backgroundColor: accounting.platformPaymentEnabled ? '#E8F5E9' : '#F5F5F5',
                      color: accounting.platformPaymentEnabled ? '#2E7D32' : '#757575',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Tooltip>
              </Box>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#2C2B35', minWidth: 170 }}>
                  Järjestelmä
                </Typography>
                <Chip
                  label={accounting.paymentSystem === 'nomentia' ? 'Nomentia (Integrata)' : 'Oma järjestelmä'}
                  size="small"
                  sx={{
                    backgroundColor: accounting.paymentSystem === 'nomentia' ? '#E3F2FD' : '#FFF3E0',
                    color: accounting.paymentSystem === 'nomentia' ? '#1565C0' : '#E65100',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Verkkopalkat */}
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Verkkopalkat
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#2C2B35', minWidth: 170 }}>
                  Käytössä
                </Typography>
                <Chip
                  label={accounting.onlineSalaries ? 'Kyllä' : 'Ei'}
                  size="small"
                  sx={{
                    backgroundColor: accounting.onlineSalaries ? '#E8F5E9' : '#F5F5F5',
                    color: accounting.onlineSalaries ? '#2E7D32' : '#757575',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kirjanpidon tiedot — rich text */}
      <Card sx={{ ...cardStyles, height: 'auto' }}>
        <CardContent>
          <Box sx={sectionHeaderStyles}>
            <EditNoteIcon sx={{ color: '#E53935' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
              Kirjanpidon tiedot
            </Typography>
          </Box>
          <RichTextEditor initialValue={accounting.accountingNotes} />
        </CardContent>
      </Card>

    </Box>
  );
};
