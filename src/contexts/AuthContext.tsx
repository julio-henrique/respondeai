import { createContext, ReactNode, useState, useEffect } from "react"

import { auth, firebase } from "../services/firebase"

type User = {
    id: string,
    name: string,
    avatar: string
}

type AuthContextType = {
    user: User | undefined,
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [ user, setUser ] = useState<User>()

    // Vamos salvar o usuario, para que depois de entrar, continue com os seus dados na aplicação
    useEffect(() => {
        /* 
            Oque esta função faz: Assim que o nosso componente principal da aplicação 
            for exibido em tela, neste caso o App.tsx (este mesmo componente),
            ele vai executar este código que irá no firebase verificar se o 
            usuário já tinha feito autenticação em algum momento.
            Se sim, então ele vai ir e preencher as informações do usuário automaticamente.    
        */
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                throw new Error('Missing either Name or photo from Google Account')
                }

                setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        // Criando o login

        const result = await auth.signInWithPopup(provider)
        // Escolhendo como fazer o login, neste caso com um popup
        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                // Condicional para negar o login a usuários que não tenham foto ou nome
                throw new Error('Missing either Name or photo from Google Account')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
      </AuthContext.Provider>
    )       
}
