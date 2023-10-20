import ReactDOM from 'react-dom';

import Routers from './Routers';

import './index.css';
import './assets/fonts/iconfont.css'


// 因react-virtualized不支持react的StrictMode，所以取消使用StrictMode
ReactDOM.render(
  <Routers />,
  document.getElementById('root')
);