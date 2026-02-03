'use server';

/**
 * @fileOverview This file provides a mock implementation for fetching vendor details from a GST API.
 */

/**
 * Fetches vendor details for a given GST number.
 * @param gstNumber The 15-digit GST number.
 * @returns A promise that resolves to the vendor's details.
 */
export async function fetchVendorDetailsFromGST(gstNumber: string): Promise<{
  legalName: string;
  address: string;
  panNumber: string;
  registrationDate: string;
}> {
  console.log(`Fetching details for GST: ${gstNumber}`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // A real PAN is encoded in the GST number. The 3rd to 12th characters of a GSTIN is the PAN.
  const panNumber = gstNumber.substring(2, 12).toUpperCase();

  // Return mock data based on the GST number for more realistic demo
  if (gstNumber.startsWith('29')) { // Karnataka
    return {
      legalName: 'Fictionery Karnataka Pvt Ltd',
      address: '123, Fictional Road, Koramangala, Bengaluru, Karnataka 560034',
      panNumber: panNumber,
      registrationDate: '01/07/2017',
    };
  }

  if (gstNumber.startsWith('07')) { // Delhi
    return {
        legalName: 'Delhi Mock Goods Co',
        address: '456, Mockingbird Lane, Innovation City, Delhi 110001',
        panNumber: panNumber,
        registrationDate: '15/08/2018',
    };
  }

  return {
    legalName: 'GIZMO-GADGETS PRIVATE LIMITED',
    address: '789, Business Avenue, Commerce City, Mumbai, Maharashtra 400001',
    panNumber: panNumber,
    registrationDate: '22/10/2019',
  };
}
