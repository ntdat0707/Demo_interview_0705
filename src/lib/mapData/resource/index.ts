// export function mapDataResource(rawData: any, isArray: boolean) {
//   if (isArray === true) {
//     rawData.map((row: any) => {
//       const images = [];
//       let avatar = {};
//       for (let i = 0; i < row.images.length; i++) {
//         if (row.images[i].isAvatar === true) {
//           avatar = row.images[i];
//         } else {
//           images.push(row.images[i]);
//         }
//       }
//       row.images = images;
//       row.avatar = avatar;
//       return row;
//     });
//   } else if (isArray === false) {
//     const images = [];
//     let avatar = {};
//     for (let i = 0; i < rawData.images.length; i++) {
//       if (rawData.images[i].isAvatar === true) {
//         avatar = rawData.images[i];
//       } else {
//         images.push(rawData.images[i]);
//       }
//     }
//     rawData.images = images;
//     rawData.avatar = avatar;
//     return rawData;
//   }
//   return rawData;
// }
