import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useSocketContext } from "../../../context/SocketContext";
import { resetState } from "../../../redux/action";
import { openCreateGroupbar } from "../../../redux/interactionSlice";

export function ChatListHeaderDropDownMenu({
  dropdown,
  setDropdown,
}: {
  dropdown: boolean
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {socket} = useSocketContext()

  const logout = () => {
    dispatch(resetState())
    socket.disconnect()
    navigate('/')
  }

  const options = [
    {
      title: 'New Group',
      fn: () => {
        setDropdown(false)
        dispatch(openCreateGroupbar())
      },
    },
    {
      title: 'Settings',
      fn: () => {},
    },
    {
      title: 'Logout',
      fn: logout,
    },
  ]

  return (
    <ul
      className={`${
        dropdown ? 'visible' : 'invisible'
      } transition-[visibility] absolute top-full right-0 min-w-fit whitespace-nowrap w-32 max-h-60 mt-1 bg-light-bg-primary dark:bg-dark-fillOne py-1 rounded-md border dark:border-dark-separator text-sm dark:text-dark-text-primary shadow-lg`}
    >
      {options.map(({ title, fn}) => {
        return (
          <li key={title} className='px-4 py-2 dark:hover:bg-dark-bg-secondary'>
            <button
              onClick={fn}
            >
              {title}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
  