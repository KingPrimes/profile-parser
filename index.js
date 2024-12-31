import ProfileParser from '@wfcd/profile-parser';
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

async function main(name) {
  const profileData = await fetch('https://content.warframe.com/dynamic/getProfileViewingData.php?n='+name);
  const textData = await profileData.text();
  // 尝试解析 JSON
  const jsonData = JSON.parse(textData);
  const user = new ProfileParser(jsonData,'en', true);

  return user;
}
app.listen(3000, () => {
  console.log('listen:3000');
})
app.get('/api', (req, res) => {
    main(req.query.name)
      .then(user => {
        res.status(200).json({
          code: 200,
          message: '成功',
          data: user
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          code: 500,
          message: '没有找到该玩家',
          error: err
        });
      });
  });
