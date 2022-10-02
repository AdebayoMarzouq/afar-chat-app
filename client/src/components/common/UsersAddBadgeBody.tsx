import { Badge } from './Badge'
import { UserType } from '../../types/user';

export function UsersAddBadgeBody({
  badgeItems,
  removeUserFromForm
}: {badgeItems: UserType[], removeUserFromForm: (email: string) => void}) {
  return (
    <div className='p-4 max-h-48 flex flex-shrink gap-y-1 items-center flex-wrap overflow-auto border-b dark:border-dark-separator'>
      {badgeItems.map(
        (item: {
          email: string
          username: string
          profile_image: string
        }) => (
          <Badge
            key={item.email}
            title={item.username}
            avatar={item.profile_image}
            closeFunc={() => removeUserFromForm(item.email)}
          />
        )
      )}
    </div>
  )
}
