import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { APP } from '../../constants/app'

export const DocumentTitle = ({ title }) => {
  if (!title || APP.NAME.LONG === title) {
    return (
      <Helmet>
        <title>{APP.NAME.LONG}</title>
      </Helmet>
    )
  }

  return (
    <Helmet>
      <title>
        {title} | {APP.NAME.LONG}
      </title>
    </Helmet>
  )
}

DocumentTitle.propTypes = {
  title: PropTypes.string,
}

DocumentTitle.defaultProps = {
  title: APP.NAME.LONG,
}
