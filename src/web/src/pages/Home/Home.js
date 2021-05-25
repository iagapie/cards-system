import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

export const Home = () => {
  console.log(process.env)
  return (
    <>
      <h1>Home Page</h1>
      <div>
        <FontAwesomeIcon icon={faFacebook} />
      </div>
    </>
  )
}
