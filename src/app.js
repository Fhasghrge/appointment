import VConsole from 'vconsole';
import './app.scss';

const DEV = process.env.NODE_ENV === 'development'
if(!DEV) {
  new VConsole();
}
function App(props) {
  return props.children;
}

export default App
