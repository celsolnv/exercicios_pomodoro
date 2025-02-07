import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelupModal';

export const ChallengeContext = createContext({} as ChallengeContextData);
interface Challenge{
    type: "body" | "eye";
    description: string;
    amount: number;
}

interface ChallengeContextProviderProps {
    children : ReactNode;
    level?:number;
    currentExperience?:number;
    challengesCompleted?:number;
}
interface ChallengeContextData{
    level:number;
    currentExperience:number;
    challengesCompleted:number;
    experienceNextToLevel:number;
    activeChallenge: Challenge;
    levelUp: ()=> void;
    startNewChallenge:()=> void;
    resetChallenge:()=> void;
    completeChallenge:()=> void;
    closeLevelUpModal:()=> void;
}
export function ChallengeContextProvider({ children, ...rest }:ChallengeContextProviderProps){

    const [level, setLevel] = useState(rest.level ??  1 );
    const [currentExperience, setCurrentExperience] = useState( rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState( rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceNextToLevel = Math.pow( (level+1) * 4,2 );

    useEffect(()=>{
        Notification.requestPermission();
    }, [] );

    useEffect(() => {
        Cookies.set("level",String(level));
        Cookies.set("currentExperience",String(currentExperience));
        Cookies.set("challengesCompleted",String(challengesCompleted));
        
    }, [level,currentExperience,challengesCompleted])

    function levelUp(){
        setLevel(level +1);
        setIsLevelUpModalOpen(true);
    }
    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        
        setActiveChallenge(challenge);

        new Audio('/sons/notification_3.mp3').play();
        if(Notification.permission === 'granted'){
            new Notification('Novo Desafio 🎉',{
                body:`Valendo ${challenge.amount}xp!`
            });
        }
    }   

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }
    function resetChallenge(){
        setActiveChallenge(null);
    }
    function completeChallenge(){
        if(!activeChallenge){
            return;
        }
        const {amount} = activeChallenge;
        let finalExperience = amount + currentExperience;

        if( finalExperience >= experienceNextToLevel ){
            finalExperience = finalExperience - experienceNextToLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);

    }
    return (    
    <ChallengeContext.Provider 
        value={{
            level,
            levelUp ,
            currentExperience,
            challengesCompleted,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            experienceNextToLevel,
            completeChallenge,
            closeLevelUpModal
        }}>

        {children}
        {
            isLevelUpModalOpen && <LevelUpModal/>
        }
    </ChallengeContext.Provider>

    )
}