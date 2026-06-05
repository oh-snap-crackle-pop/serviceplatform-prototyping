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
    icon: <ArticleIcon sx={{ fontSize: 18, color: '#fff' }} />,
  },
  xlsx: {
    color: '#217346',
    label: 'XLSX',
    icon: <TableChartIcon sx={{ fontSize: 18, color: '#fff' }} />,
  },
  pdf: {
    color: '#B91C1C',
    label: 'PDF',
    icon: <PictureAsPdfIcon sx={{ fontSize: 18, color: '#fff' }} />,
  },
  pptx: {
    color: '#C43E1C',
    label: 'PPTX',
    icon: <SlideshowIcon sx={{ fontSize: 18, color: '#fff' }} />,
  },
};

// ── Document list item (horizontal) ──────────────────────────────────────────

const DocumentListItem: React.FC<{ doc: ServiceDescription }> = ({ doc }) => {
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.5,
        px: 0.5,
        borderRadius: 1,
        transition: 'background-color 0.15s',
        '&:hover': { backgroundColor: '#f9f9f9' },
      }}
    >
      {/* File type badge */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          backgroundColor: cfg.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </Box>

      {/* Name + metadata */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#2C2B35',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
            mb: 0.25,
          }}
        >
          {doc.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FolderIcon sx={{ fontSize: '0.7rem', color: '#aaa' }} />
          <Typography
            variant="caption"
            sx={{ color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {doc.libraryPath} · {formatDate(doc.modifiedDate)}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Tooltip title="Avaa SharePointissa">
          <IconButton
            size="small"
            component={Link}
            href={doc.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#0078D4' }}
          >
            <LaunchIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Lataa">
          <IconButton
            size="small"
            component={Link}
            href={doc.downloadUrl}
            download
            sx={{ color: '#666' }}
          >
            <DownloadIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={copied ? 'Linkki kopioitu!' : 'Kopioi linkki'}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{ color: copied ? '#217346' : '#666' }}
          >
            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
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
  height: '100%',
};

const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2,
};

export const BillingSection: React.FC<BillingSectionProps> = ({ customer }) => {
  return (
    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>

      {/* Vasen palsta: Palvelukuvaukset */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={cardStyles}>
          <CardContent>
            <Box sx={sectionHeaderStyles}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2B35' }}>
                Palvelukuvaukset
              </Typography>
            </Box>
            {customer.billing.serviceDescriptions.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <DocumentListItem doc={doc} />
                {index < customer.billing.serviceDescriptions.length - 1 && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Oikea palsta: Laskutusohjeet */}
      <Grid size={{ xs: 12, md: 7 }}>
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
      </Grid>

    </Grid>
  );
};
