import { inquiryTypeMap } from '../constants/inquiry-type.constant';
import { InquiryType } from '../enums/inquiry-type.enum';

export const getInquiryType = (inquiryTypeName: string): InquiryType => {
  if (inquiryTypeMap[InquiryType.PreBuiltHouse]?.includes(inquiryTypeName)) {
    return InquiryType.PreBuiltHouse;
  }
  if (inquiryTypeMap[InquiryType.OpenSale]?.includes(inquiryTypeName)) {
    return InquiryType.OpenSale;
  }
  return InquiryType.Other;
};
