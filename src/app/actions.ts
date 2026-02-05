
'use server';

import {
  prefillVendorDetailsFromGST,
  type PrefillVendorDetailsFromGSTOutput,
} from '@/ai/flows/prefill-vendor-details-from-gst';
import { verifyBankAccount } from '@/services/penny-drop-api';

export async function handleGstAutofill(
  gstNumber: string
): Promise<{ data: PrefillVendorDetailsFromGSTOutput | null; error: string | null }> {
  if (!gstNumber || gstNumber.length !== 15) {
    return { data: null, error: 'Please enter a valid 15-digit GST number.' };
  }

  try {
    const details = await prefillVendorDetailsFromGST({ gstNumber });
    return { data: details, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        'Failed to fetch details. Please check the GST number and try again.',
    };
  }
}

export async function handlePennyDropVerification(
  accountNumber: string,
  ifscCode: string
): Promise<{ success: boolean; message: string; beneficiaryName: string; error: string | null }> {
  if (!accountNumber || !ifscCode) {
    return { success: false, message: '', beneficiaryName: '', error: 'Account number and IFSC code are required.' };
  }

  try {
    const result = await verifyBankAccount(accountNumber, ifscCode);
    return { ...result, error: null };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '',
      beneficiaryName: '',
      error: 'An unexpected error occurred during verification.',
    };
  }
}
