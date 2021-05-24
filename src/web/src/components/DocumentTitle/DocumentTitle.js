import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

export const DocumentTitle = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
)

DocumentTitle.propTypes = {
  title: PropTypes.string,
}

DocumentTitle.defaultProps = {
  title: 'Cards System',
}
