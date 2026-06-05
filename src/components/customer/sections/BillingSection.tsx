import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Link,
  IconButton,
  Divider,
  Tooltip,
  Grid,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import type { Customer, ServiceDescription, ServiceDescriptionFileType, UserPermissions } from '../../../data/customerMockData';

interface BillingSectionProps {
  customer: Customer;
  permissions: UserPermissions;
}

// ── File type config ──────────────────────────────────────────────────────────

const FILE_TYPE_CONFIG: Record<ServiceDescriptionFileType, {
  color: string;
  label: string;
  icon: React.ReactElement;
}> = {
  docx: {
    color: '#0078D4',
    label: 'DOCX',
    icon: <ArticleIcon sx={{ fontSize: 40, color: '#fff' }} />,
  },
  xlsx: {
    color: '#217346',
    label: 'XLSX',
    icon: <TableChartIcon sx={{ fontSize: 40, color: '#fff' }} />,
  },
  pdf: {
    color: '#B91C1C',
    label: 'PDF',
    icon: <PictureAsPdfIcon sx={{ fontSize: 40, color: '#fff' }} />,
  },
  pptx: {
    color: '#C43E1C',
    label: 'PPTX',
    icon: <SlideshowIcon sx={{ fontSize: 40, color: '#fff' }} />,
  },
};

// ── SharePoint document card ──────────────────────────────────────────────────

const DocumentCard: React.FC<{ doc: ServiceDescription }> = ({ doc }) => {
  const [copied, setCopied] = useState(false);
  const cfg = FILE_TYPE_CONFIG[doc.fileType];

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.documentUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric', year: 'numeric' });

  return (
    <Card
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderRadius: 2,
        border: '1px solid #e8e8e8',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          borderColor: '#c0c0c0',
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          backgroundColor: cfg.color,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {cfg.icon}
        <Chip
          label={cfg.label}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.30)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.65rem',
            height: 20,
            letterSpacing: 0.5,
          }}
        />
      </Box>

      {/* Metadata */}
      <CardContent sx={{ flex: 1, pb: 0, pt: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#2C2B35',
            lineHeight: 1.35,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {doc.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <FolderIcon sx={{ fontSize: '0.8rem', color: '#888' }} />
          <Typography variant="caption" sx={{ color: '#888', lineHeight: 1.2 }}>
            {doc.libraryPath}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#aaa' }}>
          Muokattu {formatDate(doc.modifiedDate)} · {doc.modifiedBy}
        </Typography>
      </CardContent>

      {/* Actions */}
      <Box sx={{ px: 1.5, py: 1 }}>
        <Divider sx={{ mb: 0.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Avaa SharePointissa">
            <IconButton
              size="small"
              component={Link}
              href={doc.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#0078D4' }}
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lataa">
            <IconButton
              size="small"
              component={Link}
              href={doc.downloadUrl}
              download
              sx={{ color: '#555' }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={copied ? 'Linkki kopioitu!' : 'Kopioi linkki'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ color: copied ? '#217346' : '#555' }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            component={Link}
            href={doc.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#0078D4',
              fontWeight: 500,
              fontSize: '0.72rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Avaa
          </Typography>
        </Box>
      </Box>
    </Card>
  );
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
          minHeight: 160,
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
        }}
      />
    </Box>
  );
};

// ── Main section ──────────────────────────────────────────────────────────────

const cardStyles = {
  backgroundColor: '#FFFFFF',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderRadius: 2,
};

const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2.5,
};

export const BillingSection: React.FC<BillingSectionProps> = ({ customer }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Palvelukuvaukset */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#2C2B35', mb: 2 }}
        >
          Palvelukuvaukset
        </Typography>
        <Grid container spacing={2}>
          {customer.billing.serviceDescriptions.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <DocumentCard doc={doc} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Laskutusohjeet */}
      <Card sx={cardStyles}>
        <CardContent>
          <Box sx={sectionHeaderStyles}>
            <ReceiptIcon sx={{ color: '#E53935' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
              Laskutusohjeet
            </Typography>
          </Box>

          {/* General instructions link */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              mb: 3,
              backgroundColor: '#F5F5F5',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <InfoIcon sx={{ color: '#E53935', flexShrink: 0 }} />
            <Link
              href={customer.billing.generalInstructionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#2C2B35',
                fontWeight: 500,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Yleiset laskutusohjeet
              <OpenInNewIcon sx={{ fontSize: '0.9rem' }} />
            </Link>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Customer-specific instructions */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2C2B35', mb: 1.5 }}>
            Asiakaskohtaiset laskutusohjeet
          </Typography>
          <RichTextEditor initialValue={customer.billing.customerSpecificInstructions} />
        </CardContent>
      </Card>

    </Box>
  );
};
