import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useMemo } from 'react'

import { appName } from '@/utils/constants'

export const PageTitle = ({ title, separator }) => {
  const _title = useMemo(
    () => (!title || title === appName.long ? title : `${title}${separator}${appName.long}`),
    [title, separator],
  )

  return (
    <Helmet>
      <title>{_title}</title>
    </Helmet>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string,
  separator: PropTypes.string,
}

PageTitle.defaultProps = {
  title: appName.long,
  separator: ' | ',
}
