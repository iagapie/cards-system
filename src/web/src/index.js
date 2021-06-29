import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'regenerator-runtime/runtime'

import GlobalCss from '@/theme/Global.css'
import { loadFonts } from '@/utils/loadFonts'

import { sagaMiddleware, store } from './store'
import rootSaga from './store/rootSaga'
import { App } from './App'

sagaMiddleware.run(rootSaga)

render(
  <Provider store={store}>
    <GlobalCss />
    <App />
  </Provider>,
  document.getElementById('root'),
  loadFonts,
)
