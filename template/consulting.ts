import { IBaseEmailTemplate } from './index';
export interface IEmailConsultingTemplate extends IBaseEmailTemplate {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
}
