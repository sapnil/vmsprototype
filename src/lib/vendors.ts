export type Site = {
  id: string;
  gstNumber: string;
  legalName: string;
  contactPerson: string;
  contactEmail: string;
  dateAdded: string;
  status: 'Approved' | 'Pending' | 'Rejected';
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
        contactPerson: 'Rohan Sharma',
        contactEmail: 'rohan@innovatesupplies.com',
        dateAdded: '2023-10-15',
        status: 'Approved',
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
        contactPerson: 'Priya Mehta',
        contactEmail: 'priya.m@quantum.co',
        dateAdded: '2023-11-01',
        status: 'Pending',
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
        contactPerson: 'Anil Kumar',
        contactEmail: 'anil@greenscape.com',
        dateAdded: '2023-09-20',
        status: 'Approved',
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
        contactPerson: 'Sunita Rao',
        contactEmail: 'sunita.r@techgenix.io',
        dateAdded: '2023-11-05',
        status: 'Rejected',
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
        contactPerson: 'Vikram Singh',
        contactEmail: 'vikram.singh@apexlog.com',
        dateAdded: '2023-08-12',
        status: 'Approved',
      },
      {
        id: 'SITE006',
        gstNumber: '22EECDE1234F1Z5',
        legalName: 'Apex Global Logistics (Warehouse)',
        contactPerson: 'Vikram Singh',
        contactEmail: 'vikram.singh@apexlog.com',
        dateAdded: '2023-11-12',
        status: 'Pending',
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
        contactPerson: 'Neha Desai',
        contactEmail: 'neha@creativeminds.design',
        dateAdded: '2023-11-10',
        status: 'Pending',
      },
    ],
  },
];
