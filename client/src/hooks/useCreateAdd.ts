import React, { useState } from 'react'
import { UserType } from '../types/user'

export const useCreateAdd = () => {
  const [search, setSearch] = useState('')
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [form, setForm] = useState<string[]>([])

  const handleUserSelect = (user: UserType) => {
    const check = form.includes(user.email)
    if (check) return console.log('user added already')
    setForm((prev) => [...prev, user.email])
    setBadgeItems((prev) => [...prev, user])
  }

  const removeUserFromForm = (user_email: string) => {
    setForm((prev) => [
        ...prev.filter((item) => {
          if (item !== user_email) {
            return item
          }
        }),
      ])

    setBadgeItems((prev) =>
      prev.filter((item) => {
        if (item.email !== user_email) {
          return item
        }
      })
    )
  }

  return {search, setSearch, badgeItems, setBadgeItems, form, setForm, handleUserSelect, removeUserFromForm}
}
