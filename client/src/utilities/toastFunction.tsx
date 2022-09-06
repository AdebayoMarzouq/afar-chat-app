import { toast } from 'react-toastify'
import { CustomToast } from '../components'

export const MyToast = ({textContent}:{textContent: string}) => {
  toast(<CustomToast text={textContent} />)
}
