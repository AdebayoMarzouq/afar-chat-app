import React from "react";
import { UserType } from "../../types/user";
import { SearchListItem } from "./SearchListItem";

export function SearchUsersList({ users, openSelected }: { users: UserType[], openSelected: (uuid:string)=>void}) {
  return (
    <div className='pb-4 overflow-y-auto flex-grow'>
      {users.map((user) => (
        <SearchListItem key={user.uuid} openSelected={openSelected} {...user} />
      ))}
    </div>
  )
}
  