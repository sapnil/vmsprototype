export type Site = {
  id: string;
  gstNumber: string;
  legalName: string;
  address: string;
  registrationDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  dateAdded: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  natureOfBusiness: string;
  natureOfExpense: string;
  paymentFrequency: string;
};

export type Vendor = {
  id: string;
  tradeName: string;
  panNumber: string;
  sites: Site[];
};

export const mockVendors: Vendor[] = [
  {
    id: 'VEN001',
    tradeName: 'Innovate Supplies',
    panNumber: 'AABCDE1234F',
    sites: [
      {
        id: 'SITE001',
        gstNumber: '29AABCDE1234F1Z5',
        legalName: 'Innovate Supplies Pvt. Ltd.',
        address: '123, Fictional Road, Koramangala, Bengaluru, Karnataka 560034',
        registrationDate: '01/07/2017',
        contactPerson: 'Rohan Sharma',
        contactEmail: 'rohan@innovatesupplies.com',
        contactPhone: '+91 98765 43210',
        dateAdded: '2023-10-15',
        status: 'Approved',
        bankName: 'HDFC Bank',
        accountNumber: '50100123456789',
        ifscCode: 'HDFC0000123',
        branchName: 'Koramangala',
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Monthly',
      },
    ],
  },
  {
    id: 'VEN002',
    tradeName: 'Quantum Solutions',
    panNumber: 'BBCDE1234F',
    sites: [
      {
        id: 'SITE002',
        gstNumber: '27BBCDE1234F1Z5',
        legalName: 'Quantum Solutions LLP',
        address:
          '789, Business Avenue, Commerce City, Mumbai, Maharashtra 400001',
        registrationDate: '22/10/2019',
        contactPerson: 'Priya Mehta',
        contactEmail: 'priya.m@quantum.co',
        contactPhone: '+91 98765 43211',
        dateAdded: '2023-11-01',
        status: 'Pending',
        bankName: 'ICICI Bank',
        accountNumber: '000101234567',
        ifscCode: 'ICIC0000001',
        branchName: 'Bandra Kurla Complex',
        natureOfBusiness: 'Manufacturer',
        natureOfExpense: 'Raw Material',
        paymentFrequency: 'Per Invoice',
      },
    ],
  },
  {
    id: 'VEN003',
    tradeName: 'GreenScape Services',
    panNumber: 'CCDE1234F',
    sites: [
      {
        id: 'SITE003',
        gstNumber: '36CCDE1234F1Z5',
        legalName: 'GreenScape Landscaping',
        address: 'Plot 42, Sector 18, Gurgaon, Haryana 122001',
        registrationDate: '05/03/2020',
        contactPerson: 'Anil Kumar',
        contactEmail: 'anil@greenscape.com',
        contactPhone: '+91 98765 43212',
        dateAdded: '2023-09-20',
        status: 'Approved',
        bankName: 'Axis Bank',
        accountNumber: '912345678901',
        ifscCode: 'UTIB0000001',
        branchName: 'Cyber City',
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Quarterly',
      },
    ],
  },
  {
    id: 'VEN004',
    tradeName: 'TechGenix',
    panNumber: 'DDECDE1234F',
    sites: [
      {
        id: 'SITE004',
        gstNumber: '24DDECDE1234F1Z5',
        legalName: 'TechGenix Systems',
        address: '456, Mockingbird Lane, Innovation City, Delhi 110001',
        registrationDate: '15/08/2018',
        contactPerson: 'Sunita Rao',
        contactEmail: 'sunita.r@techgenix.io',
        contactPhone: '+91 98765 43213',
        dateAdded: '2023-11-05',
        status: 'Rejected',
        bankName: 'Kotak Mahindra Bank',
        accountNumber: '123456789012',
        ifscCode: 'KKBK0000123',
        branchName: 'Connaught Place',
        natureOfBusiness: 'Trader',
        natureOfExpense: 'Capital Goods',
        paymentFrequency: 'Annually',
      },
    ],
  },
  {
    id: 'VEN005',
    tradeName: 'Apex Logistics',
    panNumber: 'EECDE1234F',
    sites: [
      {
        id: 'SITE005',
        gstNumber: '21EECDE1234F1Z5',
        legalName: 'Apex Global Logistics',
        address:
          '1st Floor, Trade Center, Near Port, Chennai, Tamil Nadu 600001',
        registrationDate: '11/11/2011',
        contactPerson: 'Vikram Singh',
        contactEmail: 'vikram.singh@apexlog.com',
        contactPhone: '+91 98765 43214',
        dateAdded: '2023-08-12',
        status: 'Approved',
        bankName: 'State Bank of India',
        accountNumber: '10987654321',
        ifscCode: 'SBIN0000123',
        branchName: 'Port Branch',
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Monthly',
      },
      {
        id: 'SITE006',
        gstNumber: '22EECDE1234F1Z5',
        legalName: 'Apex Global Logistics (Warehouse)',
        address:
          'Warehouse Complex, Industrial Area, Nagpur, Maharashtra 440001',
        registrationDate: '12/12/2012',
        contactPerson: 'Vikram Singh',
        contactEmail: 'vikram.singh@apexlog.com',
        contactPhone: '+91 98765 43214',
        dateAdded: '2023-11-12',
        status: 'Pending',
        bankName: 'State Bank of India',
        accountNumber: '10987654321',
        ifscCode: 'SBIN0000456',
        branchName: 'Industrial Area Branch',
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Per Invoice',
      },
    ],
  },
  {
    id: 'VEN006',
    tradeName: 'Creative Minds',
    panNumber: 'FFCDE1234F',
    sites: [
      {
        id: 'SITE007',
        gstNumber: '07FFCDE1234F1Z5',
        legalName: 'Creative Minds Design Studio',
        address: '456, Mockingbird Lane, Innovation City, Delhi 110001',
        registrationDate: '15/08/2018',
        contactPerson: 'Neha Desai',
        contactEmail: 'neha@creativeminds.design',
        contactPhone: '+91 98765 43215',
        dateAdded: '2023-11-10',
        status: 'Pending',
        bankName: 'Yes Bank',
        accountNumber: '0123456789012',
        ifscCode: 'YESB0000123',
        branchName: 'Hauz Khas',
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Per Invoice',
      },
    ],
  },
];
