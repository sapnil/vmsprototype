export type Vendor = {
  id: string;
  tradeName: string;
  legalName: string;
  contactPerson: string;
  contactEmail: string;
  dateAdded: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export const mockVendors: Vendor[] = [
  {
    id: 'VEN001',
    tradeName: 'Innovate Supplies',
    legalName: 'Innovate Supplies Pvt. Ltd.',
    contactPerson: 'Rohan Sharma',
    contactEmail: 'rohan@innovatesupplies.com',
    dateAdded: '2023-10-15',
    status: 'Approved',
  },
  {
    id: 'VEN002',
    tradeName: 'Quantum Solutions',
    legalName: 'Quantum Solutions LLP',
    contactPerson: 'Priya Mehta',
    contactEmail: 'priya.m@quantum.co',
    dateAdded: '2023-11-01',
    status: 'Pending',
  },
  {
    id: 'VEN003',
    tradeName: 'GreenScape Services',
    legalName: 'GreenScape Landscaping',
    contactPerson: 'Anil Kumar',
    contactEmail: 'anil@greenscape.com',
    dateAdded: '2023-09-20',
    status: 'Approved',
  },
  {
    id: 'VEN004',
    tradeName: 'TechGenix',
    legalName: 'TechGenix Systems',
    contactPerson: 'Sunita Rao',
    contactEmail: 'sunita.r@techgenix.io',
    dateAdded: '2023-11-05',
    status: 'Rejected',
  },
  {
    id: 'VEN005',
    tradeName: 'Apex Logistics',
    legalName: 'Apex Global Logistics',
    contactPerson: 'Vikram Singh',
    contactEmail: 'vikram.singh@apexlog.com',
    dateAdded: '2023-08-12',
    status: 'Approved',
  },
  {
    id: 'VEN006',
    tradeName: 'Creative Minds',
    legalName: 'Creative Minds Design Studio',
    contactPerson: 'Neha Desai',
    contactEmail: 'neha@creativeminds.design',
    dateAdded: '2023-11-10',
    status: 'Pending',
  },
];
