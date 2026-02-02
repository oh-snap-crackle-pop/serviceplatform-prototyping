import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { BenefitsDashboard } from './components/employee/BenefitsDashboard';
import { StandardBenefits } from './components/employee/StandardBenefits';
import { OptionalBenefits } from './components/employee/OptionalBenefits';
import { DiscountCodes } from './components/employee/DiscountCodes';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { BenefitsAdmin } from './components/admin/BenefitsAdmin';
import { OptionalBenefitsAdmin } from './components/admin/OptionalBenefitsAdmin';
import { DiscountCodesAdmin } from './components/admin/DiscountCodesAdmin';
import { CustomerSite } from './components/customer/CustomerSite';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Employee views */}
            <Route path="/" element={<Navigate to="/benefits" replace />} />
            <Route path="/benefits" element={<BenefitsDashboard />} />
            <Route path="/benefits/standard" element={<StandardBenefits />} />
            <Route path="/benefits/optional" element={<OptionalBenefits />} />
            <Route path="/benefits/discounts" element={<DiscountCodes />} />

            {/* Customer Site */}
            <Route path="/customer" element={<CustomerSite />} />

            {/* Admin views */}
            <Route path="/admin" element={<AnalyticsDashboard />} />
            <Route path="/admin/standard" element={<BenefitsAdmin />} />
            <Route path="/admin/optional" element={<OptionalBenefitsAdmin />} />
            <Route path="/admin/discounts" element={<DiscountCodesAdmin />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/benefits" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
