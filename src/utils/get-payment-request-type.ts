import { CommissionFeeType } from '../enums/payment-request-type.enum';

export const getPaymentRequestType = (mstCommissionFeeTemplateName: string | null): CommissionFeeType => {
  if (mstCommissionFeeTemplateName?.includes('紹介')) {
    return CommissionFeeType.One;
  }
  return CommissionFeeType.Two;
};
