import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/ko';

dayjs.extend(advancedFormat);
dayjs.locale('ko');

export default dayjs;
