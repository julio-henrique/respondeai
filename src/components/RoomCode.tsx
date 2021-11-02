import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import copyImg from '../assets/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
        toast.success('Código da Sala copiado!')
    }

    return (
      <>
        <ToastContainer position="bottom-right" />
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
          <div>
            <img src={copyImg} alt="Copy room code" />
          </div>
          <span>Sala  #{props.code}</span>
        </button>
    </>
  )
}