'use server';

/**
 * @fileOverview This file defines a Genkit flow to prefill vendor registration details (except trade name) by integrating with the GST API.
 *
 * The flow takes a GST number as input and returns the vendor's registration details.
 * It exports the `prefillVendorDetailsFromGST` function, the `PrefillVendorDetailsFromGSTInput` type, and the `PrefillVendorDetailsFromGSTOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {fetchVendorDetailsFromGST} from '@/services/gst-api';

const PrefillVendorDetailsFromGSTInputSchema = z.object({
  gstNumber: z
    .string()
    .describe('The GST number of the vendor.'),
});
export type PrefillVendorDetailsFromGSTInput = z.infer<typeof PrefillVendorDetailsFromGSTInputSchema>;

const PrefillVendorDetailsFromGSTOutputSchema = z.object({
  legalName: z.string().describe('The legal name of the vendor.'),
  address: z.string().describe('The address of the vendor.'),
  panNumber: z.string().describe('The PAN number of the vendor.'),
  registrationDate: z.string().describe('The registration date of the vendor.'),
});
export type PrefillVendorDetailsFromGSTOutput = z.infer<typeof PrefillVendorDetailsFromGSTOutputSchema>;

export async function prefillVendorDetailsFromGST(input: PrefillVendorDetailsFromGSTInput): Promise<PrefillVendorDetailsFromGSTOutput> {
  return prefillVendorDetailsFromGSTFlow(input);
}

const prefillVendorDetailsFromGSTFlow = ai.defineFlow(
  {
    name: 'prefillVendorDetailsFromGSTFlow',
    inputSchema: PrefillVendorDetailsFromGSTInputSchema,
    outputSchema: PrefillVendorDetailsFromGSTOutputSchema,
  },
  async input => {
    const vendorDetails = await fetchVendorDetailsFromGST(input.gstNumber);
    return vendorDetails;
  }
);
