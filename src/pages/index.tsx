import { useSession, signIn, signOut } from "next-auth/client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Container, UserNameButton, UserNameContainer,GithubButton,Title } from '../styles/pages/index';

export default function Home(){
    const [userName, setUserName] = useState('');
    const [session] = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session){
            router.push("/home")
            return;
        }
    }, [session])
    return(
        <Container>
            <img src="/images/simbolo.png" alt="simbolo" />
            <div>
                <img src="/images/logo.png" alt="logo" />
                <div>
                    <Title>Bem-vindo</Title>
                    <GithubButton 
                        onClick={()=>{signIn('github',{callbackUrl:'/home'})}}
                    >
                        <img src="/icons/github.svg" alt="icon github" />
                        <span>Faça login com seu github para começar</span>
                    </GithubButton>
                    <UserNameContainer >
                        <input 
                            type="text" 
                            placeholder="Digite seu username" 
                            value={userName} 
                            onChange={(e)=>{
                                setUserName(e.target.value)
                            }}
                        />
                        <UserNameButton isActive={Boolean(userName)} >
                            <img src="/icons/right.svg" alt="arrow right" />
                        </UserNameButton>
                    </UserNameContainer>

                </div>
            </div>
        </Container>

    )
}

