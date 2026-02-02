import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

interface CopyableCodeProps {
  code: string;
  showFullCode?: boolean;
}

export const CopyableCode: React.FC<CopyableCodeProps> = ({ code, showFullCode = true }) => {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'action.hover',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
        }}
      >
        {showFullCode && (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {code}
          </Typography>
        )}
        <Tooltip title={copied ? 'Kopioitu!' : 'Kopioi koodi'}>
          <IconButton size="small" onClick={handleCopy}>
            {copied ? (
              <CheckIcon fontSize="small" color="success" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Koodi kopioitu leikepöydälle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};
