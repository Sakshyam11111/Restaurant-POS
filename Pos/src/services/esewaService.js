import CryptoJS from 'crypto-js';

const ESEWA_CONFIG = {
  merchantCode: 'EPAYTEST',
  secretKey: '8gBm/:&EnhH.1/q',
  paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  successUrl: `${window.location.origin}/checkout/success`,
  failureUrl: `${window.location.origin}/checkout/failure`,
};

const generateSignature = (params) => {
  const message = `total_amount=${params.total_amount},transaction_uuid=${params.transaction_uuid},product_code=${ESEWA_CONFIG.merchantCode}`;
  const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return hashInBase64;
};

const generateTransactionUUID = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const initiateEsewaPayment = (paymentData) => {
  const { amount, orderId } = paymentData;
  
  const transactionUuid = generateTransactionUUID();
  
  const params = {
    amount: amount.toString(),
    tax_amount: '0',
    total_amount: amount.toString(),
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.merchantCode,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: ESEWA_CONFIG.successUrl,
    failure_url: ESEWA_CONFIG.failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: '',
  };

  params.signature = generateSignature(params);

  return {
    url: ESEWA_CONFIG.paymentUrl,
    params,
    transactionUuid,
  };
};

export const verifyEsewaPayment = (responseData) => {
  try {
    const { data } = responseData;
    
    const decodedData = JSON.parse(atob(data));
    
    const message = `transaction_uuid=${decodedData.transaction_uuid},product_code=${ESEWA_CONFIG.merchantCode},total_amount=${decodedData.total_amount},status=${decodedData.status}`;
    const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.secretKey);
    const calculatedSignature = CryptoJS.enc.Base64.stringify(hash);
    
    const isValid = calculatedSignature === decodedData.signature;
    
    return {
      isValid,
      transactionData: decodedData,
      status: decodedData.status,
      amount: decodedData.total_amount,
      transactionUuid: decodedData.transaction_uuid,
      refId: decodedData.ref_id,
    };
  } catch (error) {
    console.error('Error verifying eSewa payment:', error);
    return {
      isValid: false,
      error: error.message,
    };
  }
};

export const formatAmount = (amount) => {
  return `Rs ${parseFloat(amount).toFixed(2)}`;
};

export default {
  initiateEsewaPayment,
  verifyEsewaPayment,
  formatAmount,
};