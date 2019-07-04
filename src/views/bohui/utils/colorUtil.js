export const activeObjList = [
  {
    name: '农业用地',
    color: 'rgba(255,190,190)',
    value: 'farmland'
  },
  {
    name: '居民点',
    color: 'rgba(255,0,197)',
    value: 'citizen'
  },
  {
    name: '工矿用地',
    color: 'rgba(0,112,255)',
    value: 'industrial'
  },
  {
    name: '养殖场',
    color: 'rgba(0,255,197)',
    value: 'livestock'
  },
  {
    name: '交通设施',
    color: 'rgba(180,200,125)',
    value: 'traffic'
  },
  {
    name: '旅游设施',
    color: 'rgba(0,255,0)',
    value: 'tourist'
  },
  {
    name: '采石场',
    color: 'rgba(100,150,150)',
    value: 'stonePit'
  },
  {
    name: '能源设施',
    color: 'rgba(200,180,0)',
    value: 'energy'
  },
  {
    name: '其它人工设施',
    color: 'rgba(255,0,0)',
    value: 'other'
  }
];

export const getColor = () => {
  const colorStr = '0123456789abcdef';
  let colorVal = '#';
  for (let l = 0; l < 6; l++) {
    const index = parseInt(Math.random() * colorStr.length);
    colorVal += colorStr.charAt(index)
  }
  return colorVal
};

const colorMap = new Map();
const humanActiveMap = new Map();
colorMap.set('farmland', 'rgba(255,190,190)'); // 农田
colorMap.set('农业用地', 'rgba(255,190,190)'); // 农田
humanActiveMap.set('farmland','农业用地');

colorMap.set('citizen','rgba(255,0,197)'); // 居民点
colorMap.set('居民点','rgba(255,0,197)'); // 居民点
humanActiveMap.set('citizen','居民点');

colorMap.set('industrial','rgba(0,112,255)'); //工矿用地
colorMap.set('工矿用地','rgba(0,112,255)'); //工矿用地
humanActiveMap.set('industrial','工矿用地');

colorMap.set('livestock','rgba(0,255,197)'); //养殖场
colorMap.set('养殖场','rgba(0,255,197)'); //养殖场
humanActiveMap.set('livestock','养殖场');

colorMap.set('tourist','rgba(0,255,0)'); // 旅游设施
colorMap.set('旅游设施','rgba(0,255,0)'); // 旅游设施
humanActiveMap.set('tourist','旅游设施');

colorMap.set('traffic', 'rgba(180,200,125)'); // 交通设施
colorMap.set('交通设施', 'rgba(180,200,125)'); // 交通设施
humanActiveMap.set('traffic','交通设施');

colorMap.set('stonePit', 'rgba(100,150,150)');//采石场
colorMap.set('采石场', 'rgba(100,150,150)');//采石场
humanActiveMap.set('stonePit','采石场');

colorMap.set('energy','rgba(200,180,0)'); //能源设施
colorMap.set('能源设施','rgba(200,180,0)'); //能源设施
humanActiveMap.set('energy','能源设施');

colorMap.set('other', 'rgba(255,0,0)'); //其它人工设施
colorMap.set('其它人工设施', 'rgba(255,0,0)'); //其它人工设施
humanActiveMap.set('other','其它人工设施');

export const ColorMap = colorMap;

export const HumanActiveMapping = humanActiveMap;

export const getFillColorByData = (data, fillColor) => {
  if (fillColor) {
    if (data.color) {
      return window.resetColor ? '#fff' : data.color;
    }
    data.color = fillColor;
    return data.color
  } else {
    if (data.color) {
      return window.resetColor ? '#ffffff' : data.color;
    }
    data.color = ColorMap.get(data.properties.humanActive); // colorVal;
    return data.color;
  }
};
