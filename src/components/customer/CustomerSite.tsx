import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { customerData, integrataUserPermissions, customerUserPermissions } from '../../data/customerMockData';
import type { UserPermissions } from '../../data/customerMockData';

// Section components
import { CollaborationSection } from './sections/CollaborationSection';
import { ServicesProductsSection } from './sections/ServicesProductsSection';
import { BillingSection } from './sections/BillingSection';
import { PayrollSection } from './sections/PayrollSection';
import { AccountingSection } from './sections/AccountingSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { StakeholdersSection } from './sections/StakeholdersSection';
import { LinksSection } from './sections/LinksSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const sections = [
  { label: 'Yhteistyö', id: 'yhteistyo', internal: false },
  { label: 'Palvelut', id: 'palvelut', internal: false },
  { label: 'Laskutus', id: 'laskutus', internal: false },
  { label: 'Palkanlaskenta', id: 'palkanlaskenta', internal: false },
  { label: 'Kirjanpito', id: 'kirjanpito', internal: false },
  { label: 'Aikataulu', id: 'aikataulu', internal: false },
  { label: 'Sidosryhmät', id: 'sidosryhmat', internal: false },
  { label: 'Linkit', id: 'linkit', internal: false },
];

export const CustomerSite: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isIntegrataUser, setIsIntegrataUser] = useState(true);
  const navigate = useNavigate();

  const permissions: UserPermissions = isIntegrataUser
    ? integrataUserPermissions
    : customerUserPermissions;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderTabLabel = (section: typeof sections[0]) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {section.label}
      {section.internal && !permissions.canViewInternalSections && (
        <LockIcon sx={{ fontSize: 14 }} />
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#FFFAF4',
        minHeight: 'calc(100vh - 64px)',
        mx: -3,
        mt: -3,
        p: 4,
      }}
    >
      {/* Header with back button and user toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ color: '#2C2B35', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: '#2C2B35', cursor: 'pointer' }}
            onClick={handleBack}
          >
            Takaisin
          </Typography>
        </Box>

        {/* User type toggle for demo */}
        <FormControlLabel
          control={
            <Switch
              checked={isIntegrataUser}
              onChange={(e) => setIsIntegrataUser(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Chip
              label={isIntegrataUser ? 'Integrata-käyttäjä' : 'Asiakaskäyttäjä'}
              size="small"
              color={isIntegrataUser ? 'primary' : 'default'}
              sx={{ ml: 1 }}
            />
          }
        />
      </Box>

      {/* Customer name */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 900,
          fontSize: '3rem',
          color: '#2C2B35',
          mb: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {customerData.name}
      </Typography>

      {/* Employee count badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Chip
          label={`${customerData.employeeCount} työntekijää`}
          size="small"
          sx={{ backgroundColor: '#E8E8E8', color: '#2C2B35' }}
        />
        <Typography variant="body2" sx={{ color: '#666' }}>
          Asiakasnumero: {customerData.customerId}
        </Typography>
      </Box>

      {/* Section tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#E0E0E0', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: '#2C2B35',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 'auto',
              px: 2,
              '&.Mui-selected': {
                color: '#E53935',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#E53935',
            },
          }}
        >
          {sections.map((section) => (
            <Tab key={section.id} label={renderTabLabel(section)} />
          ))}
        </Tabs>
      </Box>

      {/* Tab panels */}
      <TabPanel value={tabValue} index={0}>
        <CollaborationSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ServicesProductsSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BillingSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <PayrollSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <AccountingSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <ScheduleSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        <StakeholdersSection customer={customerData} permissions={permissions} />
      </TabPanel>
      <TabPanel value={tabValue} index={7}>
        <LinksSection customer={customerData} permissions={permissions} />
      </TabPanel>
    </Box>
  );
};
