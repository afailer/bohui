import reqest from './request'

const { get, post, del } = reqest;

const baseUrl = 'http://39.104.185.135:8084';

export const geoIp = 'http://10.5.10.8:8082';

const baseGeoJsonUrl = '/geojson';

export const getRedlineData = (areaCode, dataTime) => {
  const url = baseUrl + `/redlineData/data?areaCode=${areaCode}&dataTime=${dataTime}`;
  return get(url)
};

export const getHumanActiveData = (areaCode, time, type) => {
  const url = baseUrl + `/humanAction/speckle?areaCode=${areaCode}&dataTime=${time}&type=${type}`
  return get(url)
};

export const getGeoDataByAreaCode = (areaCode) => {
  const url = baseGeoJsonUrl + `/yuzhongData.json`;
  return get(url)
};

export const getJinZhiGeoDataByAreaCode = (areaCode) => {
  const url = baseGeoJsonUrl + `/jinzhi.json`;
  return get(url)
};

export const getKeXuePGGeoDataByAreaCode = (areaCode) => {
  const url = baseGeoJsonUrl + `/kexuepinggu.json`;
  return get(url)
};

export const getHumanActiveDataByAreaCode = (areaCode, time) => {
  let url = '';
  if (String(time) === '2019') {
    console.log('----load2019-----' + time);
    url = baseGeoJsonUrl + `/humanActive2019.json`;
  } else if (String(time) === '2018') {
    console.log('----load2018-----' + time);
    url = baseGeoJsonUrl + `/humanActive2018.json`;
  }
  return get(url)
};

export const getGeoImgUrlByAreaCode = (areaCode, time) => {
  return new Promise((resolve, reject) => {
    resolve(geoIp + '/geoserver/gwc/service/tms/1.0.0/ecology%3Ayuzhong_pct@EPSG%3A900913@png/{z}/{x}/{y}.png')
  })
}
