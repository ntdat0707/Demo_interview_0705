export function mapDataSolution(rawData: any, isArray: boolean) {
  if (isArray === true) {
    rawData.map((row: any) => {
      const images = [];
      let banner = {};
      for (let i = 0; i < row.images.length; i++) {
        if (row.images[i].isBanner === true) {
          banner = row.images[i];
        } else {
          images.push(row.images[i]);
        }
      }
      row.images = images;
      row.banner = banner;
      return row;
    });
  } else if (isArray === false) {
    const images = [];
    let banner = {};
    for (let i = 0; i < rawData.images.length; i++) {
      if (rawData.images[i].isBanner === true) {
        banner = rawData.images[i];
      } else {
        images.push(rawData.images[i]);
      }
    }
    rawData.images = images;
    rawData.avatar = banner;
    return rawData;
  }
  return rawData;
}
