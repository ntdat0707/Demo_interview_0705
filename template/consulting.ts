import { IBaseEmailTemplate } from './index';
export interface IEmailConsultingTemplate extends IBaseEmailTemplate {
  name: string;
  country: string;
  phone: string;
  company: string;
  city: string;
  street: string;
}
