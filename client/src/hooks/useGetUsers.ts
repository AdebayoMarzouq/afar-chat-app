import { useEffect, useState } from "react"
import { UserType } from "../types/user"

export const useGetUsers = () => {
  const [user, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
  }, [])
}
