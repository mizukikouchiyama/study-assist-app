import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'yyyy年MM月dd日') => {
    return format(date, formatStr, { locale: ja });
};
