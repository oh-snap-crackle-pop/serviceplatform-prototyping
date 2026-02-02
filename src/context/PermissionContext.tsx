import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { UserPermissions } from '../data/customerMockData';
import { integrataUserPermissions, customerUserPermissions } from '../data/customerMockData';

type UserType = 'integrata' | 'customer';

interface PermissionContextType {
  userType: UserType;
  permissions: UserPermissions;
  setUserType: (type: UserType) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>('integrata');

  const permissions = useMemo(() => {
    return userType === 'integrata' ? integrataUserPermissions : customerUserPermissions;
  }, [userType]);

  const contextValue = useMemo(
    () => ({ userType, permissions, setUserType }),
    [userType, permissions]
  );

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};
