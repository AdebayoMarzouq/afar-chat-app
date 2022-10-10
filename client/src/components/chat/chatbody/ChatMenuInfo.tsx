import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../../../context/SocketContext";
import { removeGroup, setSelected } from "../../../redux/chatSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { request } from "../../../utilities/request";
import { Avatar } from "../../common/Avatar";
import { ChatMenuListItem } from "./ChatMenuListItem";

function ChatMenuOption({
  color,
  icon,
  text,
  fn,
}: {
  color?: string
  icon: React.ReactNode
  text: string
  fn?: () => void
}) {
  return (
    <div
      className='[&:last-of-type>div]:border-b-0 dark:border-dark-separator cursor-pointer pl-2 md:pl-4 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary active:bg-gray-200 dark:active:bg-dark-bg-secondary'
      onClick={fn}
    >
      <div className='h-20 flex items-center justify-center'>
        <div
          className={`w-12 h-12 rounded-full ${
            color || 'bg-light-main-primary dark:bg-dark-main-primary'
          } text-white inline-flex justify-center items-center`}
        >
          {icon}
        </div>
      </div>
      <div className='h-20 flex items-center gap-2 pr-2 md:pr-4 flex-grow border-b dark:border-inherit capitalize font-semibold'>
        {text}
      </div>
    </div>
  )
}

export function ChatMenuInfo({
  setAddParticipant,
}: {
  setAddParticipant: React.Dispatch<React.SetStateAction<boolean>>
  }) {
  const { socket } = useSocketContext()
  const dispatch = useDispatch<AppDispatch>()
  const {userInfo} = useSelector((state: RootState) => state.user)
  const { selected, chatDataLoading, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: false,
  })
  const { room, participants } = chatDataCollection[selected]

  const exitGroup = async (user_id: string) => {
    const form_data = {
      room_id: selected,
      user_id,
    }
    setSubmitStatus((prev) => {
      return { ...prev, loading: true }
    })
    try {
      const response = await request({
        url: '/api/chat/leave',
        method: 'DELETE',
        payload: form_data
      })
      if (response.status === 200) {
        // *Success toast
        // *Remove all room data here
        dispatch(setSelected(''))
        dispatch(removeGroup({ room_id: form_data.room_id, user_id}))
        socket.emit(
        'leave_group',
        form_data.room_id,
        user_id
        )
      } else if(response.status === 401) {
        // *Add to general display or alert error
      }
    } catch (error) {
      console.log(error)
      setSubmitStatus((prev) => {
        return { ...prev, error: true }
      })
      //* pass toast here
    } finally {
      setSubmitStatus((prev) => {
        return { ...prev, loading: false }
      })
    }
  }
  

  return (
    <>
      <div className='flex flex-col gap-2 items-center justify-center py-8'>
        <Avatar size={32} />
        <div>
          {room.is_group && (
            <>Group &bull; {participants.length} Participants</>
          )}
        </div>
      </div>
      <div className='w-full h-32 px-2 text-sm md:px-4 py-2 overflow-hidden'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, autem.
        Fugiat illum qui ipsa fugit? Fugiat cumque nostrum, doloremque atque
        dolore voluptas hic vitae neque iste maxime. Dolorum tenetur inventore
        quaerat et fugiat nesciunt blanditiis, eligendi id reprehenderit maxime
        harum dignissimos qui accusamus! Suscipit accusamus ipsum quaerat
        fugiat, iste temporibus, officiis totam ad et molestias voluptates quos
        vero. Neque numquam beatae, est blanditiis repudiandae quo aut! Fuga
        doloribus tempora autem placeat aliquam magni voluptatibus commodi eum
        itaque quos, sit tempore blanditiis! Eum, corrupti deleniti! Distinctio
        ipsam unde placeat aperiam perspiciatis animi odio expedita quam, quidem
        doloremque at, sint id qui aliquid explicabo corporis, magni accusamus
        aliquam velit facere? Quasi at quibusdam iste omnis commodi eveniet quia
        maiores blanditiis repellendus, deserunt, tenetur aspernatur fuga optio
        quaerat iure cum. Nesciunt consequuntur dolores voluptates pariatur
        dolore sapiente exercitationem magni quo ratione facilis architecto
        culpa commodi rerum at non quas aperiam, quasi iure eaque officiis
        omnis! Itaque deleniti eum repellendus tempore iusto sint, modi quidem
        officiis corporis rem obcaecati cupiditate nihil numquam enim vero
        ratione sequi quisquam porro sapiente illo explicabo! Maiores architecto
        cumque porro nobis. Architecto, consequuntur! Adipisci omnis ab minus
        doloremque dolorem perferendis voluptas, pariatur optio ullam quo odit
        repudiandae, facilis necessitatibus!
      </div>
      <div className='w-full'>
        <h3 className='text-gray-400 dark:text-dark-text-secondary px-6 py-2'>
          7 participants
        </h3>
        {room.creator.uuid === userInfo!.uuid && (
          <ChatMenuOption
            icon={
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                />
              </svg>
            }
            text='add participant'
            fn={() => setAddParticipant(true)}
          />
        )}
        <ChatMenuOption
          icon={
            <svg
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
                clipRule='evenodd'
              />
            </svg>
          }
          text='Group Link'
        />
        <ul className=''>
          {participants &&
            participants.map((participant) => {
              return (
                <ChatMenuListItem
                  key={participant.uuid}
                  creator={room.creator.uuid}
                  {...participant}
                />
              )
            })}
        </ul>
        <ChatMenuOption
          color='bg-red-500'
          fn={() => exitGroup(userInfo!.uuid)}
          icon={
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
          }
          text='Exit group'
        />
      </div>
    </>
  )
}
  