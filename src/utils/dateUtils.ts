import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMMM yyyy', { locale: tr });
}; 