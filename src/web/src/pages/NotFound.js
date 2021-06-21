import { DocumentTitle } from '../components/DocumentTitle'

export const NotFound = () => (
  <main className="h-full bg-gray-100">
    <DocumentTitle title="Not Found" />
    <div className="flex flex-col items-center md:w-3/4 lg:w-2/3 xl:w-2/5 mx-auto px-4 py-20">
      <h1 className="pb-5 text-blue-gray-500 text-3xl font-bold">Board not found.</h1>
      <p className="text-blue-gray-500 text-lg text-center">
        This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
      </p>
    </div>
  </main>
)
