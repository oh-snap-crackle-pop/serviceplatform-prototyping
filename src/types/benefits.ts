// Benefit types and interfaces

export type BenefitCategory =
  | 'lunch'
  | 'sports'
  | 'culture'
  | 'commute'
  | 'phone'
  | 'insurance'
  | 'healthcare'
  | 'wellbeing'
  | 'other';

export type BenefitStatus = 'active' | 'draft' | 'archived' | 'upcoming' | 'expired';

export type ValueUnit = 'day' | 'month' | 'year' | 'one-time';

export interface LocalizedString {
  fi: string;
  en: string;
  sv: string;
}

export interface BenefitValue {
  amount: number;
  unit: ValueUnit;
  currency: 'EUR';
}

export interface Benefit {
  id: string;
  type: 'standard' | 'optional';
  name: LocalizedString;
  description: string;
  category: BenefitCategory;
  value: BenefitValue;
  status: BenefitStatus;
  validFrom: string;
  validTo?: string;
  icon?: string;
  externalLink?: string;
  targetGroups?: string[];
}

export interface OptionalBenefitGroup {
  id: string;
  name: LocalizedString;
  description: string;
  options: Benefit[];
  selectionPeriod: {
    start: string;
    end: string;
  };
  changeRestrictions: string;
}

export interface DiscountCode {
  id: string;
  partnerName: string;
  partnerLogo?: string;
  description: string;
  code: string;
  discountAmount: string;
  category: string[];
  validFrom: string;
  validTo: string;
  partnerUrl: string;
}

export interface EmployeeBenefitSelection {
  employeeId: string;
  groupId: string;
  selectedOptionId: string;
  selectedAt: string;
}

export interface BenefitAnalytics {
  totalEmployees: number;
  totalAnnualCost: number;
  averageBenefitValue: number;
  optionalParticipationRate: number;
  benefitDistribution: {
    category: BenefitCategory;
    count: number;
    totalValue: number;
  }[];
  monthlyTrend: {
    month: string;
    cost: number;
  }[];
  optionalSelections: {
    optionId: string;
    optionName: string;
    count: number;
    percentage: number;
  }[];
}

export interface Department {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}
