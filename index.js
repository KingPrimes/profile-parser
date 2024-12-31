// import ProfileParser from '@wfcd/profile-parser';
import WorldStateParser  from 'warframe-worldstate-parser';
// const user = new ProfileParser(await profileData.text());
import bodyParser from 'body-parser';
import express  from 'express';
import cors  from'cors';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.send(200);
    next();
  });

// async function main(name) {
//   const profileData = await fetch('https://content.warframe.com/dynamic/getProfileViewingData.php?n='+name);
//   const textData = await profileData.text();
//   // 尝试解析 JSON
//   const jsonData = JSON.parse(textData);
//   const user = new ProfileParser(jsonData,'en', true);  
//   return user;
// }

// async function getUser(name) {
//   return main(name)
//   .then(user =>{
//     // 使用 map 方法来创建一个新数组
//     user.profile.loadout.weaponSkins = user.profile.loadout.weaponSkins.map(wss => {
//       return {
//         ...wss,
//         item: {
//           ...wss.item,
//           i18n: {
//             zh: wss.item?.i18n?.zh           
//           },
//           patchlogs:[]
//         }
//       };
//     });
//     user.profile.loadout.suits = user.profile.loadout.suits.map(s =>{
//       const updatedComponents = Object.keys(s.item.components).reduce((acc, key) => {
//         // 为每个组件添加 'drops' 属性，并保留现有属性
//         acc[key] = {
//           ...s.item.components[key],
//           // 添加或覆盖 'drops' 属性
//           drops: {},
//         };
//         return acc;
//       }, {});
//       const config = s.configs?.map(cf => {
//         const skin = cf.skins.map(s=>{
//           return {
//             ...s,
//             item:{
//               ...s.item,
//               i18n: {
//                 zh: s.item?.i18n?.zh           
//               },
//               patchlogs:[]
//             }
//           }
//         })
//         return {
//           ...cf,
//           skins: skin
//         };
//       });
//       return {
//         ...s,
//         item:{
//           ...s.item,
//           components: updatedComponents,
//           i18n: {
//             zh: s.item?.i18n?.zh           
//           },
//           patchlogs:[]
//         },        
//         configs: config        
//       }
//     });
    
//     user.profile.loadout.secondary = user.profile.loadout.secondary.map(se=>{
//       const components = se.item.components.map(com=>{
//         return {
//           ...com,
//           drops:[]
//         }
//       })
//       return {
//         ...se,
//         item:{
//           ...se.item,
//           components: components,
//           i18n: {
//             zh: se.item?.i18n?.zh
//           }
//         }
//       }
//     });

//     user.profile.loadout.primary = user.profile.loadout.primary.map(pr=>{
//       const config = pr.configs?.map(cf => {
//         const skin = cf.skins.map(s=>{
//           return {
//             ...s,
//             item:{
//               ...s.item,
//               i18n: {
//                 zh: s.item?.i18n?.zh           
//               },
//               patchlogs:[]
//             }
//           }
//         })
//         return {
//           ...cf,
//           skins: skin
//         };
//       });
//       return {
//         ...pr,
//         item:{
//           ...pr.item,
//           i18n: {
//             zh: pr.item?.i18n?.zh
//           },
//           patchlogs:[]
//         },
//         configs: config
//       }
//     })

//     user.profile.loadout.melee = user.profile.loadout.melee.map(me=>{
//       const config = me.configs?.map(cf => {
//         const skin = cf.skins.map(s=>{
//           return {
//             ...s,
//             item:{
//               ...s.item,
//               i18n: {
//                 zh: s.item?.i18n?.zh           
//               },
//               patchlogs:[]
//             }
//           }
//         })
//         return {
//           ...cf,
//           skins: skin
//         };
//       });
//       return {
//         ...me,
//         item:{
//           ...me.item,
//           i18n: {
//             zh: me.item?.i18n?.zh
//           },
//           patchlogs:[]
//         },
//         configs: config
//       }
//     })

//     user.profile.loadout.xpInfo = user.profile.loadout.xpInfo
//     .sort((a,b)=> b.xp - a.xp)
//     .slice(0, 10)
//     .map(xp=>{
//       const components = xp.item?.components?.map(com=>{
//         return {
//           ...com,
//           drops:[]
//         }
//       })
//       return {
//         ...xp,
//         item: {
//           ...xp.item,
//           i18n: {
//             zh: xp.item?.i18n?.zh
//           },
//           patchlogs:[],
//           components: components
//         }
//       }
//     })
//     user.profile = {
//       ...user.profile,
//       challengeProgress: [],
//       missions:[]
//     }
//     user.stats = {
//       ...user.stats,
//       abilities:[],
//       enemies: [],
//       missions: [],
//       scans: [],
//       weapons: []
//     }

//     return user;
//   })
//   .catch(err => {
//     throw err;
//   })
// }

async function state(){
  const worldstateData = await fetch('https://content.warframe.com/dynamic/worldState.php').then((data) => data.text());
  return new WorldStateParser(worldstateData);
}

const errMsg = '没有找到该玩家/玩家已被封禁';
const errCode = 204;
const suerrMsg = '成功';
const suerrCode = 200;

// 个人信息
/* app.get('/api/profile', (req, res) => {
  getUser(req.query.name)
      .then(user => {
        res.status(suerrCode).json({
          code: suerrCode,
          message: suerrMsg,
          data: user
        });
      })
      .catch(err => {      
        res.status(errCode).json({
          code: errCode,
          message: errMsg,
          data: err
        });
      });
  });
  // 统计
  app.get('/api/stats', (req, res) => {
    getUser(req.query.name)
      .then(user => {
        res.status(suerrCode).json({
          code: suerrCode,
          message: suerrMsg,
          data: user.stats
        });
      })
      .catch(err => {
        console.log(err);
        res.status(errCode).json({
          code: errCode,
          message: errMsg,
          data: err
        });
      });
  });
  // 最后登录日期
  app.get('/api/expirydate', (req, res) => {
    main(req.query.name)
      .then(user => {
        res.status(suerrCode).json({
          code: suerrCode,
          message: suerrMsg,
          data: user.xpCacheExpiryDate
        });
      })
      .catch(err => {
        console.log(err);
        res.status(errCode).json({
          code: errCode,
          message: errMsg,
          data: err
        });
      });
  });
  // 获取所有数据
  app.get('/api', (req, res) => {
    getUser(req.query.name)
      .then(user => {
        res.status(suerrCode).json({
          code: suerrCode,
          message: suerrMsg,
          data: user
        });
      })
      .catch(err => {
        console.log(err);
        res.status(errCode).json({
          code: errCode,
          message: errMsg,
          data: err
        });
      });
  }); */
  // 获取世界状态
  app.get('/state', (req, res) => {
    state()
      .then(data => {
        res.json({
          data
        });
      })
      .catch(err => {
        console.log(err);
        res.status(errCode).json({
          code: errCode,
          message: errMsg,
      })
    })  
  })
export default app;