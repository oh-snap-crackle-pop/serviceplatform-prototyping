import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TuneIcon from '@mui/icons-material/Tune';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const employeeNavItems: NavItem[] = [
  { label: 'Etusivu', path: '/', icon: <HomeIcon /> },
  {
    label: 'Henkilöstöedut',
    path: '/benefits',
    icon: <CardGiftcardIcon />,
    children: [
      { label: 'Yhteenveto', path: '/benefits', icon: <HomeIcon /> },
      { label: 'Vakioedut', path: '/benefits/standard', icon: <CheckCircleIcon /> },
      { label: 'Valinnaiset edut', path: '/benefits/optional', icon: <TuneIcon /> },
      { label: 'Alennuskoodit', path: '/benefits/discounts', icon: <LocalOfferIcon /> },
    ],
  },
  { label: 'Asiakassivut', path: '/customer', icon: <BusinessIcon /> },
];

const adminNavItems: NavItem[] = [
  {
    label: 'Henkilöstöedut',
    path: '/admin',
    icon: <AdminPanelSettingsIcon />,
    children: [
      { label: 'Analytiikka', path: '/admin', icon: <AnalyticsIcon /> },
      { label: 'Vakioetujen hallinta', path: '/admin/standard', icon: <SettingsIcon /> },
      { label: 'Valinnaisten hallinta', path: '/admin/optional', icon: <TuneIcon /> },
      { label: 'Alennuskoodien hallinta', path: '/admin/discounts', icon: <LocalOfferIcon /> },
    ],
  },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = React.useState<string[]>(['Henkilöstöedut']);

  const handleToggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    if (path === '/' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.includes(item.label);
    const active = isActive(item.path);

    return (
      <React.Fragment key={item.path}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggleSection(item.label);
              } else {
                navigate(item.path);
              }
            }}
            selected={active && !hasChildren}
            sx={{
              pl: 2 + depth * 2,
              borderRadius: 1,
              mx: 1,
              my: 0.25,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: depth > 0 ? '0.875rem' : '0.9rem',
                fontWeight: active && !hasChildren ? 600 : 400,
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 2 }}>
        {!isAdmin && (
          <>
            <Box sx={{ px: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Työntekijänäkymä
              </Typography>
            </Box>
            <List>{employeeNavItems.map((item) => renderNavItem(item))}</List>
          </>
        )}

        {!isAdmin && <Divider sx={{ my: 2 }} />}

        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isAdmin ? 'HR-hallinta' : 'Hallinta'}
          </Typography>
        </Box>
        <List>{adminNavItems.map((item) => renderNavItem(item))}</List>
      </Box>
    </Drawer>
  );
};

export { drawerWidth };
