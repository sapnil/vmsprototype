
export type BankAccount = {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountType: 'savings' | 'current';
  ifscCode: string;
  beneficiaryName: string;
  verificationStatus: 'idle' | 'success' | 'failed';
  crn?: string;
};

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
  isActive: boolean;
  bankAccounts: BankAccount[];
  natureOfBusiness: string;
  natureOfExpense: string;
  paymentFrequency: string;
  registrationCertificate?: string;
  panCard?: string;
  addressProof?: string;
  oracleVendorId?: string;
  oracleSiteId?: string;

  departmentName?: string;
  composite?: boolean;
  eInvoiceRequired?: boolean;
  registeredUnderMsme?: boolean;
  msmeRegistrationNumber?: string;
  paygroup?: string;
  groupCode?: string;
  taxExemption?: boolean;
  tdsRate?: string;
  tdsExemptionCertificateNumber?: string;
  tdsExemptionFromDate?: string;
  tdsExemptionToDate?: string;
  itrFiled?: boolean;
  agreementStartDate?: string;
  agreementEndDate?: string;
  itrProof?: string;
  msmeCertificate?: string;
  tdsExemptionCertificate?: string;
  cancelledCheque?: string;
};

export type Vendor = {
  id: string;
  tradeName: string;
  panNumber: string;
  sites: Site[];
  isActive: boolean;
  panLinkedWithAadhar?: boolean;
};

export const mockVendors: Vendor[] = [
  {
    id: 'VEN001',
    tradeName: 'Innovate Supplies',
    panNumber: 'AABCDE1234F',
    isActive: true,
    panLinkedWithAadhar: true,
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
        isActive: true,
        bankAccounts: [
          {
            id: 'BANK001',
            bankName: 'HDFC Bank',
            branchName: 'Koramangala',
            accountNumber: '50100123456789',
            accountType: 'current',
            ifscCode: 'HDFC0000123',
            beneficiaryName: 'Innovate Supplies Pvt. Ltd.',
            verificationStatus: 'success',
            crn: 'CRN123456789',
          },
        ],
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Monthly',
        registrationCertificate: 'innovate_reg_cert.pdf',
        panCard: 'innovate_pan.pdf',
        addressProof: 'innovate_address_proof.pdf',
        oracleVendorId: 'ORA-VEN-1001',
        oracleSiteId: 'ORA-SITE-2001',
        departmentName: 'Procurement',
        composite: false,
        eInvoiceRequired: true,
        registeredUnderMsme: true,
        msmeRegistrationNumber: 'UDYAM-KA-01-0000001',
        paygroup: 'CORP_SERV',
        groupCode: 'CS_GEN',
        taxExemption: false,
        tdsRate: '2%',
        itrFiled: true,
        agreementStartDate: '2023-04-01',
        agreementEndDate: '2025-03-31',
        itrProof: 'innovate_itr_2023.pdf',
        msmeCertificate: 'innovate_msme.pdf',
      },
    ],
  },
  {
    id: 'VEN002',
    tradeName: 'Quantum Solutions',
    panNumber: 'BBCDE1234F',
    isActive: true,
    panLinkedWithAadhar: false,
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
        isActive: true,
        bankAccounts: [
            {
                id: 'BANK002',
                bankName: 'ICICI Bank',
                branchName: 'Bandra Kurla Complex',
                accountNumber: '000101234567',
                accountType: 'current',
                ifscCode: 'ICIC0000001',
                beneficiaryName: '',
                verificationStatus: 'idle'
            }
        ],
        natureOfBusiness: 'Manufacturer',
        natureOfExpense: 'Raw Material',
        paymentFrequency: 'Per Invoice',
        registrationCertificate: 'quantum_solutions_reg.pdf',
        taxExemption: true,
        tdsExemptionCertificateNumber: 'TDS-EX-CERT-555',
        tdsExemptionFromDate: '2023-04-01',
        tdsExemptionToDate: '2024-03-31',
        tdsExemptionCertificate: 'quantum_tds_exempt.pdf',
        itrFiled: false,
      },
    ],
  },
  {
    id: 'VEN003',
    tradeName: 'GreenScape Services',
    panNumber: 'CCDE1234F',
    isActive: true,
    panLinkedWithAadhar: true,
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
        isActive: false,
        bankAccounts: [
            {
                id: 'BANK003',
                bankName: 'Axis Bank',
                branchName: 'Cyber City',
                accountNumber: '912345678901',
                accountType: 'savings',
                ifscCode: 'UTIB0000001',
                beneficiaryName: '',
                verificationStatus: 'idle'
            }
        ],
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Rent',
        paymentFrequency: 'Rent',
        panCard: 'greenscape_pan.pdf',
        addressProof: 'greenscape_address.pdf',
        itrFiled: true,
        itrProof: 'greenscape_itr.pdf',
        composite: true,
        eInvoiceRequired: false,
      },
    ],
  },
  {
    id: 'VEN004',
    tradeName: 'TechGenix',
    panNumber: 'DDECDE1234F',
    isActive: false,
    panLinkedWithAadhar: true,
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
        isActive: true,
        bankAccounts: [
             {
                id: 'BANK004',
                bankName: 'Kotak Mahindra Bank',
                branchName: 'Connaught Place',
                accountNumber: '123456789012',
                accountType: 'current',
                ifscCode: 'KKBK0000123',
                beneficiaryName: 'TechGenix Systems',
                verificationStatus: 'failed',
                cancelledCheque: 'techgenix_cheque.pdf'
            }
        ],
        natureOfBusiness: 'Trader',
        natureOfExpense: 'Capital Goods',
        paymentFrequency: 'Annually',
        registrationCertificate: 'techgenix_reg.pdf',
        panCard: 'techgenix_pan.pdf',
        oracleVendorId: 'ORA-VEN-1004',
        oracleSiteId: 'ORA-SITE-2004',
      },
    ],
  },
  {
    id: 'VEN005',
    tradeName: 'Apex Logistics',
    panNumber: 'EECDE1234F',
    isActive: true,
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
        isActive: true,
        bankAccounts: [
            {
                id: 'BANK005',
                bankName: 'State Bank of India',
                branchName: 'Port Branch',
                accountNumber: '10987654321',
                accountType: 'current',
                ifscCode: 'SBIN0000123',
                beneficiaryName: 'Apex Global Logistics',
                verificationStatus: 'success',
            },
            {
                id: 'BANK006',
                bankName: 'Bank of Baroda',
                branchName: 'Main Branch',
                accountNumber: '00001234567',
                accountType: 'current',
                ifscCode: 'BARB0MUMBAI',
                beneficiaryName: '',
                verificationStatus: 'failed',
            }
        ],
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Monthly',
        registrationCertificate: 'apex_chennai_reg.pdf',
        panCard: 'apex_logistics_pan.pdf',
        addressProof: 'apex_chennai_address.pdf',
        oracleVendorId: 'ORA-VEN-1005',
        oracleSiteId: 'ORA-SITE-2005',
        cancelledCheque: 'apex_cancelled_cheque.pdf',
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
        isActive: true,
        bankAccounts: [
            {
                id: 'BANK007',
                bankName: 'State Bank of India',
                branchName: 'Industrial Area Branch',
                accountNumber: '10987654321',
                accountType: 'current',
                ifscCode: 'SBIN0000456',
                beneficiaryName: '',
                verificationStatus: 'idle',
            }
        ],
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
    isActive: true,
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
        isActive: true,
        bankAccounts: [
             {
                id: 'BANK008',
                bankName: 'Yes Bank',
                branchName: 'Hauz Khas',
                accountNumber: '0123456789012',
                accountType: 'savings',
                ifscCode: 'YESB0000123',
                beneficiaryName: '',
                verificationStatus: 'idle',
            }
        ],
        natureOfBusiness: 'Service Provider',
        natureOfExpense: 'Services',
        paymentFrequency: 'Per Invoice',
        registrationCertificate: 'creative_minds_reg.pdf',
      },
    ],
  },
];
