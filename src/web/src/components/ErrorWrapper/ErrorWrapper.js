import PropTypes from 'prop-types'

export const ErrorWrapper = ({ text }) => (
  <div>
    <div>{text}</div>
    <img
      src="https://media.giphy.com/media/5eFp76zhsq3uw/giphy.gif"
      alt="Ron Swanson"
    />
  </div>
)

ErrorWrapper.propTypes = {
  text: PropTypes.string.isRequired,
}
