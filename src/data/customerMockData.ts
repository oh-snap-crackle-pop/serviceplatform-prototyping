// Mock data for Customer Site (Asiakassivut) feature
// Based on the specification from claude-code-prompt-customer-site.md

// ============ TYPE DEFINITIONS ============

export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  systemAccess: SystemAccess[];
  stakeholderType: 'päättäjä' | 'yhteyshenkilö' | 'sidosryhmä';
  avatarColor: string;
  initials: string;
  isEditable: boolean;
}

export interface SystemAccess {
  systemName: string;
  accessLevel: string;
  permissions: string[];
}

export interface IntegrataSpecialist {
  id: string;
  name: string;
  role: SpecialistRole;
  roleLabel: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  avatarColor: string;
  initials: string;
  isInternalOnly: boolean;
}

export type SpecialistRole =
  | 'vastuusolu'
  | 'päävastuullinen_palkka'
  | 'varavastuullinen_palkka'
  | 'maksuryhmä_palkka'
  | 'päävastuullinen_yhteyspalvelu'
  | 'varavastuullinen_yhteyspalvelu'
  | 'järjestelmä_pääkäyttäjä';

export interface MeetingMinutes {
  id: string;
  date: Date;
  title: string;
  participants: string[];
  topics: string[];
  documentUrl?: string;
}

export interface CustomerService {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isActive: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  description?: string;
}

export interface PlatformFeature {
  id: string;
  name: string;
  isEnabled: boolean;
  category: string;
}

export interface BankAccount {
  payerId: string;
  bankAccount: string;
  bankName: string;
  isEditable: boolean;
}

export interface ServiceDescription {
  id: string;
  name: string;
  validFrom: Date;
  validTo?: Date;
  documentUrl?: string;
}

export interface BillingInfo {
  serviceDescriptions: ServiceDescription[];
  generalInstructions: string;
  agreedPrinciples: string;
  internalInstructions?: string; // Internal only
}

export interface CollectiveAgreement {
  id: string;
  name: string;
  code: string;
  validFrom: Date;
  validTo?: Date;
  documentUrl?: string;
}

export interface LocalAgreement {
  id: string;
  name: string;
  description: string;
  validFrom: Date;
  validTo?: Date;
  isEditable: boolean;
}

export interface PaymentGroup {
  id: string;
  name: string;
  paymentDate: string;
  payPeriod: string;
  assignedSpecialist?: string;
}

export interface Dividers {
  dayDivider: number;
  hourDivider: number;
}

export interface ExperienceCalculation {
  type: string;
  description: string;
  rules: string[];
}

export interface AccountingInfo {
  reportingDate: number;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  accountGroups: AccountGroup[];
  costAllocations: CostAllocation[];
  accrualPercentages: AccrualSetting[];
}

export interface AccountGroup {
  id: string;
  code: string;
  name: string;
}

export interface CostAllocation {
  id: string;
  code: string;
  name: string;
  type: 'kustannuspaikka' | 'projekti' | 'muu';
}

export interface AccrualSetting {
  id: string;
  type: string;
  percentage: number;
  isCustomerEditable: boolean;
}

export interface ScheduledTask {
  id: string;
  name: string;
  dueDate: Date;
  responsible?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  category: string;
}

export interface AnnualCalendarEvent {
  id: string;
  name: string;
  date: Date;
  type: 'deadline' | 'reporting' | 'payment' | 'meeting' | 'other';
  description?: string;
}

export interface Stakeholder {
  id: string;
  type: 'eläkeyhtiö' | 'tapaturmavakuutus' | 'työterveyshuolto' | 'etukumppani';
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  policyNumber?: string;
  notes?: string;
  isEditable: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  category: 'system' | 'analytics' | 'documents' | 'internal';
  icon?: string;
  isInternalOnly: boolean;
}

export interface TrustRepresentative {
  id: string;
  name: string;
  role: 'luottamusmies' | 'työsuojeluvaltuutettu';
  area?: string;
  email?: string;
  phone?: string;
}

export interface ServiceRequestData {
  date: string;
  count: number;
  avgResolutionTime: number;
}

export interface UserPermissions {
  isIntegrataUser: boolean;
  canEditContacts: boolean;
  canEditStakeholders: boolean;
  canEditLocalAgreements: boolean;
  canEditAccruals: boolean;
  canEditBankAccount: boolean;
  canViewInternalSections: boolean;
}

export interface Customer {
  id: string;
  name: string;
  customerId: string;

  // Section 1: Yhteistyö (Collaboration)
  contacts: CustomerContact[];
  specialists: IntegrataSpecialist[];
  employeeCount: number;
  trustRepresentatives: TrustRepresentative[];
  meetingMinutes: MeetingMinutes[];
  customerServiceEmail: string;

  // Section 2: Palvelut ja tuotteet (Services & Products)
  services: CustomerService[];
  infrastructureDiagramUrl?: string;
  integrations: Integration[];
  platformFeatures: PlatformFeature[];
  bankAccount: BankAccount;

  // Section 3: Laskutus (Billing)
  billing: BillingInfo;

  // Section 4: Palkanlaskenta (Payroll)
  collectiveAgreements: CollectiveAgreement[];
  localAgreements: LocalAgreement[];
  paymentGroups: PaymentGroup[];
  dividers: Dividers;
  experienceCalculation: ExperienceCalculation;

  // Section 5: Kirjanpito (Accounting)
  accounting: AccountingInfo;

  // Section 6: Aikataulu (Schedule)
  upcomingTasks: ScheduledTask[];
  annualCalendar: AnnualCalendarEvent[];

  // Section 7: Sidosryhmät (Stakeholders)
  stakeholders: Stakeholder[];

  // Section 8: Linkit (Quick Links)
  quickLinks: QuickLink[];

  // Analytics
  serviceRequests: ServiceRequestData[];

  // Work instructions
  workInstructions: string[];
}

// ============ MOCK DATA ============

export const customerData: Customer = {
  id: 'hellon-oy',
  name: 'Hellon Oy',
  customerId: 'HEL-001',

  // Section 1: Yhteistyö
  contacts: [
    {
      id: '1',
      name: 'Minna Korhonen',
      role: 'HR-päällikkö',
      email: 'minna.korhonen@hellon.fi',
      phone: '+358 40 123 4567',
      systemAccess: [
        { systemName: 'Mepco', accessLevel: 'Pääkäyttäjä', permissions: ['read', 'write', 'admin'] },
        { systemName: 'Lataamo', accessLevel: 'Käyttäjä', permissions: ['read', 'write'] },
      ],
      stakeholderType: 'päättäjä',
      avatarColor: '#4DA48A',
      initials: 'MK',
      isEditable: true,
    },
    {
      id: '2',
      name: 'Jukka Virtanen',
      role: 'Talousjohtaja',
      email: 'jukka.virtanen@hellon.fi',
      phone: '+358 40 234 5678',
      systemAccess: [
        { systemName: 'Mepco', accessLevel: 'Katselija', permissions: ['read'] },
      ],
      stakeholderType: 'päättäjä',
      avatarColor: '#2196F3',
      initials: 'JV',
      isEditable: true,
    },
    {
      id: '3',
      name: 'Anna Laine',
      role: 'Palkanlaskija',
      email: 'anna.laine@hellon.fi',
      phone: '+358 40 345 6789',
      systemAccess: [
        { systemName: 'Mepco', accessLevel: 'Käyttäjä', permissions: ['read', 'write'] },
        { systemName: 'Lataamo', accessLevel: 'Käyttäjä', permissions: ['read', 'write'] },
      ],
      stakeholderType: 'yhteyshenkilö',
      avatarColor: '#9C27B0',
      initials: 'AL',
      isEditable: true,
    },
  ],

  specialists: [
    {
      id: '1',
      name: 'Kaisa Koivisto',
      role: 'päävastuullinen_palkka',
      roleLabel: 'Päävastuullinen palkka-asiantuntija',
      email: 'kaisa.koivisto@integrata.fi',
      phone: '+358 40 111 2222',
      avatarColor: '#E53935',
      initials: 'KK',
      isInternalOnly: false,
    },
    {
      id: '2',
      name: 'Petri Nieminen',
      role: 'varavastuullinen_palkka',
      roleLabel: 'Varavastuullinen palkka-asiantuntija',
      email: 'petri.nieminen@integrata.fi',
      phone: '+358 40 222 3333',
      avatarColor: '#E53935',
      initials: 'PN',
      isInternalOnly: false,
    },
    {
      id: '3',
      name: 'Sari Mäkinen',
      role: 'päävastuullinen_yhteyspalvelu',
      roleLabel: 'Päävastuullinen palkkayhteyspalvelu',
      email: 'sari.makinen@integrata.fi',
      phone: '+358 40 333 4444',
      avatarColor: '#E53935',
      initials: 'SM',
      isInternalOnly: false,
    },
    {
      id: '4',
      name: 'Mikko Lahtinen',
      role: 'vastuusolu',
      roleLabel: 'Vastuusolu',
      email: 'mikko.lahtinen@integrata.fi',
      phone: '+358 40 444 5555',
      avatarColor: '#E53935',
      initials: 'ML',
      isInternalOnly: true,
    },
    {
      id: '5',
      name: 'Tiina Rantanen',
      role: 'järjestelmä_pääkäyttäjä',
      roleLabel: 'Mepco pääkäyttäjä',
      email: 'tiina.rantanen@integrata.fi',
      phone: '+358 40 555 6666',
      avatarColor: '#E53935',
      initials: 'TR',
      isInternalOnly: false,
    },
  ],

  employeeCount: 127,

  trustRepresentatives: [
    {
      id: '1',
      name: 'Erkki Järvinen',
      role: 'luottamusmies',
      area: 'Toimihenkilöt',
      email: 'erkki.jarvinen@hellon.fi',
      phone: '+358 40 666 7777',
    },
    {
      id: '2',
      name: 'Liisa Koskinen',
      role: 'työsuojeluvaltuutettu',
      email: 'liisa.koskinen@hellon.fi',
      phone: '+358 40 777 8888',
    },
  ],

  meetingMinutes: [
    {
      id: '1',
      date: new Date('2024-12-15'),
      title: 'Vuosiyhteistyöpalaveri 2024',
      participants: ['Minna Korhonen', 'Kaisa Koivisto', 'Petri Nieminen'],
      topics: ['Vuoden 2025 aikataulu', 'TES-muutokset', 'Järjestelmäpäivitykset'],
      documentUrl: '#',
    },
    {
      id: '2',
      date: new Date('2024-09-20'),
      title: 'Kvartaalipalaveri Q3',
      participants: ['Minna Korhonen', 'Anna Laine', 'Kaisa Koivisto'],
      topics: ['Palkkakausien tarkistus', 'Lomapalkat'],
      documentUrl: '#',
    },
    {
      id: '3',
      date: new Date('2024-06-10'),
      title: 'Kvartaalipalaveri Q2',
      participants: ['Minna Korhonen', 'Kaisa Koivisto'],
      topics: ['Kesälomat', 'Sijaisten perehdytys'],
      documentUrl: '#',
    },
  ],

  customerServiceEmail: 'asiakaspalvelu.hellon@integrata.fi',

  // Section 2: Palvelut ja tuotteet
  services: [
    { id: '1', name: 'Palkkahallinto', icon: 'payroll', isActive: true },
    { id: '2', name: 'Työajanhallinta', icon: 'time', isActive: true },
    { id: '3', name: 'Humaanimpi HR', icon: 'hr', isActive: true },
    { id: '4', name: 'Palvelualusta', icon: 'humhum', isActive: true },
    { id: '5', name: 'Matka- ja kulunhallinta', icon: 'travel', isActive: true },
    { id: '6', name: 'Ohjelmistorobotiikka', icon: 'robot', isActive: false },
    { id: '7', name: 'HR-raportointi ja analytiikka', icon: 'analytics', isActive: true },
    { id: '8', name: 'Konsultointi', icon: 'consulting', isActive: true },
  ],

  infrastructureDiagramUrl: '#',

  integrations: [
    { id: '1', name: 'Netvisor', type: 'Kirjanpito', status: 'active', description: 'Palkkakirjanpidon siirto' },
    { id: '2', name: 'Procountor', type: 'Matkalaskut', status: 'active', description: 'Matkalaskujen integraatio' },
    { id: '3', name: 'AD/Azure', type: 'Käyttäjähallinta', status: 'active', description: 'Käyttäjätietojen synkronointi' },
    { id: '4', name: 'Sympa HR', type: 'HR-järjestelmä', status: 'pending', description: 'Henkilötietojen synkronointi' },
  ],

  platformFeatures: [
    { id: '1', name: 'Sähköinen allekirjoitus', isEnabled: true, category: 'Dokumentit' },
    { id: '2', name: 'Mobiilisovellus', isEnabled: true, category: 'Käyttöliittymä' },
    { id: '3', name: 'Automaattiset muistutukset', isEnabled: true, category: 'Automaatio' },
    { id: '4', name: 'Kehittynyt raportointi', isEnabled: false, category: 'Raportointi' },
    { id: '5', name: 'API-rajapinta', isEnabled: true, category: 'Integraatiot' },
  ],

  bankAccount: {
    payerId: 'HELLON-PAY-001',
    bankAccount: 'FI21 1234 5600 0007 85',
    bankName: 'Nordea',
    isEditable: true,
  },

  // Section 3: Laskutus
  billing: {
    serviceDescriptions: [
      {
        id: '1',
        name: 'Palkkahallinnon palvelusopimus',
        validFrom: new Date('2023-01-01'),
        documentUrl: '#',
      },
      {
        id: '2',
        name: 'HR-palveluiden lisäsopimus',
        validFrom: new Date('2023-06-01'),
        documentUrl: '#',
      },
    ],
    generalInstructions: 'Palvelut laskutetaan kuukausittain jälkikäteen. SaaS-maksut sisältävät peruspalvelut sekä päivitykset. Lisätyöt laskutetaan erikseen tuntiperusteisesti.',
    agreedPrinciples: 'Kiinteä kuukausihinta perustuu henkilömäärään (127 hlö). Hinta tarkistetaan vuosittain indeksikorotuksen mukaan. Lisäpalvelut sovitaan erikseen.',
    internalInstructions: 'Asiakas kuuluu avainasiakkaisiin. Lisätöistä sovittava aina etukäteen KK:n kanssa. Laskutusviite: HEL-2023-001.',
  },

  // Section 4: Palkanlaskenta
  collectiveAgreements: [
    {
      id: '1',
      name: 'Kaupan työehtosopimus',
      code: 'KAUPPA-TES',
      validFrom: new Date('2023-02-01'),
      validTo: new Date('2025-01-31'),
      documentUrl: '#',
    },
    {
      id: '2',
      name: 'Toimihenkilöiden työehtosopimus',
      code: 'TOIM-TES',
      validFrom: new Date('2023-03-01'),
      validTo: new Date('2025-02-28'),
      documentUrl: '#',
    },
  ],

  localAgreements: [
    {
      id: '1',
      name: 'Etätyösopimus',
      description: 'Etätyön ehdot ja korvaukset. Etätyöpäiviä max 3/viikko. Etätyökorvaus 5€/päivä.',
      validFrom: new Date('2023-01-01'),
      isEditable: true,
    },
    {
      id: '2',
      name: 'Liukuva työaika',
      description: 'Liukuma-aika klo 7-9 ja 15-18. Saldoraja +/- 40 tuntia.',
      validFrom: new Date('2022-01-01'),
      isEditable: true,
    },
    {
      id: '3',
      name: 'Tulospalkkiojärjestelmä',
      description: 'Vuosittainen tulospalkkio perustuu yrityksen ja henkilökohtaisiin tavoitteisiin. Max 15% vuosipalkasta.',
      validFrom: new Date('2023-01-01'),
      isEditable: true,
    },
  ],

  paymentGroups: [
    {
      id: '1',
      name: 'Kuukausipalkkaiset',
      paymentDate: '15. päivä',
      payPeriod: 'Kuukausi',
      assignedSpecialist: 'Kaisa Koivisto',
    },
    {
      id: '2',
      name: 'Tuntipalkkaiset',
      paymentDate: '25. päivä',
      payPeriod: '2 viikkoa',
      assignedSpecialist: 'Petri Nieminen',
    },
    {
      id: '3',
      name: 'Johto',
      paymentDate: 'Kuun viimeinen päivä',
      payPeriod: 'Kuukausi',
      assignedSpecialist: 'Kaisa Koivisto',
    },
  ],

  dividers: {
    dayDivider: 21,
    hourDivider: 158,
  },

  experienceCalculation: {
    type: 'TES-pohjainen',
    description: 'Kokemusvuodet lasketaan TES:n mukaisesti alan työkokemuksesta',
    rules: [
      'Kokemusvuosiin lasketaan saman alan työkokemus',
      'Osa-aikatyö muunnetaan kokoaikaiseksi',
      'Opintojen aikainen työkokemus lasketaan 50%',
    ],
  },

  // Section 5: Kirjanpito
  accounting: {
    reportingDate: 5,
    fiscalYearStart: '01-01',
    fiscalYearEnd: '12-31',
    accountGroups: [
      { id: '1', code: '5000', name: 'Palkat ja palkkiot' },
      { id: '2', code: '5100', name: 'Eläkekulut' },
      { id: '3', code: '5200', name: 'Muut henkilösivukulut' },
      { id: '4', code: '5300', name: 'Vapaaehtoiset henkilöstökulut' },
    ],
    costAllocations: [
      { id: '1', code: '100', name: 'Hallinto', type: 'kustannuspaikka' },
      { id: '2', code: '200', name: 'Myynti', type: 'kustannuspaikka' },
      { id: '3', code: '300', name: 'Tuotanto', type: 'kustannuspaikka' },
      { id: '4', code: 'P001', name: 'Kehitysprojekti Alpha', type: 'projekti' },
    ],
    accrualPercentages: [
      { id: '1', type: 'Lomapalkkavaraus', percentage: 12.5, isCustomerEditable: true },
      { id: '2', type: 'Lomarahavaraus', percentage: 6.0, isCustomerEditable: true },
      { id: '3', type: 'Sosiaalikuluvaraus', percentage: 22.0, isCustomerEditable: false },
    ],
  },

  // Section 6: Aikataulu
  upcomingTasks: [
    {
      id: '1',
      name: 'Tammikuun palkka-ajo',
      dueDate: new Date('2025-01-13'),
      responsible: 'Kaisa Koivisto',
      status: 'upcoming',
      category: 'Palkanlaskenta',
    },
    {
      id: '2',
      name: 'Vuosi-ilmoitukset verottajalle',
      dueDate: new Date('2025-01-31'),
      responsible: 'Kaisa Koivisto',
      status: 'upcoming',
      category: 'Raportointi',
    },
    {
      id: '3',
      name: 'Työeläkeilmoitus',
      dueDate: new Date('2025-02-05'),
      responsible: 'Petri Nieminen',
      status: 'upcoming',
      category: 'Raportointi',
    },
    {
      id: '4',
      name: 'Kvartaalipalaveri Q1',
      dueDate: new Date('2025-03-15'),
      responsible: 'Minna Korhonen',
      status: 'upcoming',
      category: 'Yhteistyö',
    },
    {
      id: '5',
      name: 'TES-päivitysten tarkistus',
      dueDate: new Date('2025-02-01'),
      responsible: 'Kaisa Koivisto',
      status: 'upcoming',
      category: 'Palkanlaskenta',
    },
  ],

  annualCalendar: [
    { id: '1', name: 'Vuosi-ilmoitukset', date: new Date('2025-01-31'), type: 'deadline' },
    { id: '2', name: 'Tilinpäätöspalkkojen ajo', date: new Date('2025-02-28'), type: 'deadline' },
    { id: '3', name: 'Kesälomien suunnittelu', date: new Date('2025-03-31'), type: 'deadline' },
    { id: '4', name: 'Kesälomakauden alku', date: new Date('2025-05-02'), type: 'other' },
    { id: '5', name: 'Kesälomakauden loppu', date: new Date('2025-09-30'), type: 'other' },
    { id: '6', name: 'Budjetointi alkaa', date: new Date('2025-10-01'), type: 'deadline' },
    { id: '7', name: 'Vuosiyhteistyöpalaveri', date: new Date('2025-12-15'), type: 'meeting' },
  ],

  // Section 7: Sidosryhmät
  stakeholders: [
    {
      id: '1',
      type: 'eläkeyhtiö',
      name: 'Varma',
      contactPerson: 'Eläkeasiantuntija',
      email: 'yrityspalvelu@varma.fi',
      phone: '010 123 4567',
      accountNumber: 'VARMA-12345',
      notes: 'Sopimusnumero: V-2023-001',
      isEditable: true,
    },
    {
      id: '2',
      type: 'tapaturmavakuutus',
      name: 'If Vahinkovakuutus',
      contactPerson: 'Vakuutusneuvoja',
      email: 'yritykset@if.fi',
      phone: '010 234 5678',
      policyNumber: 'IF-TAP-2023-001',
      notes: 'Vakuutus kattaa kaikki toimipisteet',
      isEditable: true,
    },
    {
      id: '3',
      type: 'työterveyshuolto',
      name: 'Terveystalo',
      contactPerson: 'Työterveyskoordinaattori',
      email: 'tyoterveys@terveystalo.fi',
      phone: '010 345 6789',
      notes: 'Sopimus sisältää lakisääteisen ja ennaltaehkäisevän työterveyshuollon',
      isEditable: true,
    },
    {
      id: '4',
      type: 'etukumppani',
      name: 'Smartum',
      contactPerson: 'Asiakaspalvelu',
      email: 'asiakaspalvelu@smartum.fi',
      notes: 'Liikunta- ja kulttuurisetelit',
      isEditable: true,
    },
    {
      id: '5',
      type: 'etukumppani',
      name: 'Edenred',
      contactPerson: 'Yritysasiakkaat',
      email: 'yritykset@edenred.fi',
      notes: 'Lounassetelit',
      isEditable: true,
    },
  ],

  // Section 8: Linkit
  quickLinks: [
    { id: '1', label: 'Mepco', url: 'https://mepco.example.com/hellon', category: 'system', isInternalOnly: false },
    { id: '2', label: 'Lataamo', url: 'https://lataamo.example.com', category: 'system', isInternalOnly: false },
    { id: '3', label: 'HumHum HR', url: 'https://humhum.example.com/hellon', category: 'system', isInternalOnly: false },
    { id: '4', label: 'Asiakasanalytiikka', url: 'https://analytics.example.com/hellon', category: 'analytics', isInternalOnly: false },
    { id: '5', label: 'Tiedostamo', url: 'https://docs.internal.example.com/hellon', category: 'documents', isInternalOnly: true },
    { id: '6', label: 'Kehitystaulu', url: 'https://jira.internal.example.com/hellon', category: 'internal', isInternalOnly: true },
    { id: '7', label: 'Netvisor', url: 'https://netvisor.example.com', category: 'system', isInternalOnly: false },
  ],

  // Analytics
  serviceRequests: [
    { date: '1.8', count: 2, avgResolutionTime: 300 },
    { date: '2.8', count: 3, avgResolutionTime: 350 },
    { date: '3.8', count: 4, avgResolutionTime: 280 },
    { date: '4.8', count: 5, avgResolutionTime: 400 },
    { date: '5.8', count: 2, avgResolutionTime: 320 },
    { date: '6.8', count: 3, avgResolutionTime: 290 },
    { date: '7.8', count: 7, avgResolutionTime: 450 },
    { date: '8.8', count: 7, avgResolutionTime: 480 },
    { date: '9.8', count: 4, avgResolutionTime: 350 },
    { date: '10.8', count: 5, avgResolutionTime: 520 },
    { date: '11.8', count: 5, avgResolutionTime: 500 },
    { date: '12.8', count: 6, avgResolutionTime: 550 },
    { date: '13.8', count: 8, avgResolutionTime: 600 },
    { date: '14.8', count: 8, avgResolutionTime: 580 },
    { date: '15.8', count: 6, avgResolutionTime: 520 },
    { date: '16.8', count: 8, avgResolutionTime: 540 },
    { date: '17.8', count: 8, avgResolutionTime: 560 },
    { date: '18.8', count: 6, avgResolutionTime: 500 },
    { date: '19.8', count: 5, avgResolutionTime: 480 },
    { date: '20.8', count: 8, avgResolutionTime: 620 },
    { date: '21.8', count: 8, avgResolutionTime: 640 },
    { date: '22.8', count: 6, avgResolutionTime: 520 },
    { date: '23.8', count: 6, avgResolutionTime: 500 },
    { date: '24.8', count: 5, avgResolutionTime: 450 },
    { date: '25.8', count: 6, avgResolutionTime: 480 },
    { date: '26.8', count: 6, avgResolutionTime: 500 },
    { date: '27.8', count: 4, avgResolutionTime: 380 },
    { date: '28.8', count: 5, avgResolutionTime: 420 },
    { date: '29.8', count: 7, avgResolutionTime: 550 },
    { date: '30.8', count: 9, avgResolutionTime: 680 },
  ],

  workInstructions: [
    'Palkanlaskennan aikataulu ja prosessi',
    'Uuden työntekijän perehdytys',
    'Lomapäivien laskenta ja kirjaus',
    'Matkalaskujen käsittely',
    'Työsopimuksen muutokset',
  ],
};

// Default permissions for different user types
export const integrataUserPermissions: UserPermissions = {
  isIntegrataUser: true,
  canEditContacts: true,
  canEditStakeholders: true,
  canEditLocalAgreements: true,
  canEditAccruals: true,
  canEditBankAccount: true,
  canViewInternalSections: true,
};

export const customerUserPermissions: UserPermissions = {
  isIntegrataUser: false,
  canEditContacts: true,
  canEditStakeholders: true,
  canEditLocalAgreements: true,
  canEditAccruals: true,
  canEditBankAccount: true,
  canViewInternalSections: false,
};

// List of all customers for navigation
export const customerList = [
  { id: 'hellon-oy', name: 'Hellon Oy' },
  { id: 'esimerkki-oy', name: 'Esimerkki Oy' },
  { id: 'demo-oy', name: 'Demo Oy' },
];
