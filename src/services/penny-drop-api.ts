
'use server';

/**
 * @fileOverview This file provides a mock implementation for a penny-drop bank account verification API.
 */

/**
 * Mocks the verification of a bank account using account number and IFSC code.
 * @param accountNumber The bank account number.
 * @param ifscCode The IFSC code of the bank branch.
 * @returns A promise that resolves to a verification status.
 */
export async function verifyBankAccount(
  accountNumber: string,
  ifscCode: string
): Promise<{ success: boolean; message: string; beneficiaryName: string }> {
  console.log(
    `Initiating penny-drop verification for Account: ${accountNumber}, IFSC: ${ifscCode}`
  );

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock logic: Fail if account number contains '0000' or IFSC is 'TEST000FAIL'
  if (accountNumber.includes('0000') || ifscCode.toUpperCase() === 'TEST000FAIL') {
    console.log('Penny-drop failed.');
    return {
      success: false,
      message: 'Account details could not be verified. Please upload a cancelled cheque.',
      beneficiaryName: '',
    };
  }

  // Mock success
  console.log('Penny-drop successful.');
  // Typically the API returns the name of the account holder as per bank records.
  const mockBeneficiaryName = 'Test Vendor Inc.'; 
  return {
    success: true,
    message: `Verification successful. Account holder: ${mockBeneficiaryName}.`,
    beneficiaryName: mockBeneficiaryName,
  };
}
