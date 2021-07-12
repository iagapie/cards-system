import { PageTitle } from '@/components/helmet/PageTitle'

const NotFoundPage = () => {
  // TODO: add logout
  const currentUser = { name: 'Igor Agapie' }
  const isAuthenticated = true

  return (
    <main className="not-found">
      <PageTitle title="Not Found" />
      <div className="not-found__container">
        <h1 className="not-found__title">Board not found.</h1>
        <p className="not-found__text">
          This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
        </p>
        {isAuthenticated && (
          <div className="not-found__auth">
            <div>
              Not <strong className="not-found__user">{currentUser.name}</strong>?
            </div>
            <button className="not-found__btn">Switch accounts</button>
          </div>
        )}
      </div>
    </main>
  )
}

export default NotFoundPage
