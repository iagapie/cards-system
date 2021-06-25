import * as encoder from 'md5'
import querystring from 'query-string'
import isRetina from 'is-retina'
import PropTypes from 'prop-types'

export const Gravatar = ({ alt, email, md5, className, style, domain, size, rating, d, ...rest }) => {
  const base = `${domain}/avatar/`
  const query = querystring.stringify({ s: size, r: rating, d })
  const retinaQuery = querystring.stringify({ s: size * 2, r: rating, d })
  const formattedEmail = ('' + email).trim().toLowerCase()

  let hash
  if (md5) {
    hash = md5
  } else if (typeof email === 'string') {
    hash = encoder(formattedEmail, { encoding: 'binary' })
  } else {
    console.warn('Gravatar image can not be fetched. Either the "email" or "md5" prop must be specified.')
    return <script />
  }

  const src = `${base}${hash}?${query}`
  const retinaSrc = `${base}${hash}?${retinaQuery}`

  let modernBrowser = true // server-side, we render for modern browsers

  if (typeof window !== 'undefined') {
    // this is not NodeJS
    modernBrowser = 'srcset' in document.createElement('img')
  }

  if (!modernBrowser && isRetina()) {
    return <img alt={alt} style={style} src={retinaSrc} height={size} width={size} {...rest} className={className} />
  }

  return (
    <img
      alt={alt}
      style={style}
      src={src}
      srcSet={`${retinaSrc} 2x`}
      height={size}
      width={size}
      {...rest}
      className={className}
    />
  )
}

Gravatar.propTypes = {
  alt: PropTypes.string.isRequired,
  email: PropTypes.string,
  md5: PropTypes.string,
  size: PropTypes.number,
  rating: PropTypes.string,
  d: PropTypes.string,
  className: PropTypes.string,
  domain: PropTypes.string,
  style: PropTypes.object,
}

Gravatar.defaultProps = {
  size: 50,
  rating: 'g',
  d: 'retro',
  domain: 'https://www.gravatar.com',
}
