import React from 'react'
import { ChatBubbleT1 } from './ChatBubbleT1'
import { ChatBubbleT2 } from './ChatBubbleT2'
import { ChatUIHeader } from './ChatUIHeader'

const messages = [
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nihil suscipit saepe cupiditate fuga perferendis doloremque quas perspiciatis, earum nesciunt obcaecati, aliquam incidunt commodi, adipisci rem non ipsa inventore assumenda harum veritatis illo. Dicta quaerat quam, consequuntur, doloribus eveniet illo beatae recusandae voluptatem rerum iure est facere quis temporibus provident harum deserunt nulla sit exercitationem veritatis itaque similique modi consequatur? Ex aperiam a mollitia nulla ipsum, sit vero deserunt alias praesentium odio et. Porro quae labore culpa nulla possimus neque voluptate exercitationem nemo, eum in natus repellendus nesciunt error tempore, optio beatae ducimus temporibus modi architecto. Ipsum doloribus unde odio.'
  },
  { text: "Hey there! What's up", sent: true },
  { text: 'Checking out iOS7 you know..' },
  { text: 'Check out this bubble!', sent: true },
  { text: "It's pretty cool!" },
  { text: "And it's in css?" },
  { text: "Yeah it's pure CSS &amp; HTML", sent: true },
  {
    text: '(ok.. almost, I added a tiny bit of JS to remove sibling message tails)',
    sent: true,
  },
  {
    text: "Wow that's impressive. But what's even more impressive is that this bubble is really high.",
  }
]

export const ChatUI = () => {
  return (
    <div className='relative h-screen flex flex-col w-full bg-white col-span-2'>
      <ChatUIHeader />
      <div className='speech-wrapper py-4 px-8 flex-grow bg-gray-200 overflow-y-auto'>
        {messages.map((message, i) => {
          if (message.sent) {
            return <ChatBubbleT2 key={i} />
          }
          return <ChatBubbleT1 key={i} />
        })}
      </div>
      <div className='border-t mt-auto h-16 shrink-0'>
        some content
      </div>
    </div>
  )
}
