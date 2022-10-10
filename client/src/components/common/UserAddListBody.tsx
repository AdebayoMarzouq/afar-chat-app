import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType } from "../../types/user";
import { Spinner } from "../miscellaneous/Spinner";
import { SearchListItem } from "./SearchListItem";

export function UserAddListBody({
  type,
  loading,
  data,
  handleUserSelect,
  error,
}: {
  type?: string
  data: { status: number; users: UserType[] } | null
  loading: boolean
  error: string
  handleUserSelect: (user: UserType) => void
  }) {
  const {selected, chatDataCollection} = useSelector((state: RootState) => state.chat)

  return (
    <div className='flex flex-grow flex-col overflow-y-auto'>
      {loading && (
        <div className='text-center py-4'>
          <Spinner />
        </div>
      )}
      {data &&
        (data.users.length ? (
        data.users.map((user) => {
          let isAdded: UserType | undefined | false = false
          if (type === 'existing-group') {
            isAdded = chatDataCollection[selected].participants.find(
              (participant: UserType) => participant.uuid === user.uuid
            )
          }
            return (
              <button
                className='[&>div>div:last-child]:border-b dark:[&>div>div:last-child]:border-dark-separator [&:last-of-type>div>div]:border-b-0 dark:disabled:bg-dark-bg-secondary'
                type='button'
                key={user.uuid}
                disabled={isAdded ? true : false}
                onClick={() => handleUserSelect(user)}
              >
                <SearchListItem disabled={isAdded ? true : false} {...user} />
              </button>
            )
          })
        ) : (
          <div className='text-center'>No user with this search term</div>
        ))}
      {!data && error && (
        <div className='text-center'>An error occured while searching</div>
      )}
    </div>
  )
}
  