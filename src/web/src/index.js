import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'regenerator-runtime/runtime'

import { store, sagaMiddleware } from './redux/store'
import rootSaga from './redux/sagas'
import { App } from './components/App'

import './styles/index.scss'

sagaMiddleware.run(rootSaga)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
