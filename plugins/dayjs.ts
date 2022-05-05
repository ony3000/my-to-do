import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/ko';

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.locale('ko');

export default dayjs;
