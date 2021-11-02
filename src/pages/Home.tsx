import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import googleIconImg from '../assets/google-icon.svg'
import illustrationImg from '../assets/illustration.svg'
import logoImg from '../assets/logo.svg'

import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [ roomCode, setRoomCode ] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if (!roomRef.exists()) {
            toast.error('Essa sala não existe');
            return
        }

        if (roomRef.val().endedAt) {
            toast.error('Esta sala foi encerrada.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <ToastContainer />
            <aside>
                <img src={illustrationImg} alt="Ilustração de P &amp; R" />
                <strong>Crie salas de Q &amp; A ao vivo</strong>
                <p>Tire as duvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask logo" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua conta com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala" 
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
