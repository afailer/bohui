import yongdeng from './yongdeng'
import yuzhong from './yuzhong'

const areaDatas = new Map();
areaDatas.set(yongdeng.areaCode, yongdeng);
areaDatas.set(yuzhong.areaCode, yuzhong);
export default {
    areaDatas
}