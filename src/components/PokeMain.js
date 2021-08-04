import React, {useState, useEffect} from 'react';
import PokeImg from "./PokeImg.js";
import PokePanel from "./PokePanel.js";

//Number of rounds in the game
const NUM_ROUNDS = 5;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function capitalize(s){ 
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

 //function for checking valid response using unified format
 const formatGuessStr = (pokeStr) => {
    //two exceptions to the regexp rule 
            if (pokeStr === "deoxys") {return ("deoxys normal")} //only deoxys in 3rd gen, so it would be a valid response
            return (pokeStr.includes("r.")) ? (pokeStr.replace(/[\.][\s]?/g, " ")) // mr.mime/mr mime/mr. mime 
                                            : (pokeStr.replace(/[-][\s]?/g, " ")); //ho-oh/ho oh - deoxys-normal/deoxys normal
            }
//function that formats the number of the present pokemon into Assets of pokemon url
//i.e = 1 to 001
const formatPokeNum = (numPoke) =>("0".repeat(3 - String(numPoke).length) + numPoke);


const PokeMain = () => {
    //selecting range of pokemon, in this case 1st to 3rd gen
    const rnd_poke = () => getRndInteger(1,386 );
    //Hook used for the list we get from PokeAPI
    const [listOfPoke,setListOfPoke] = useState([])
    const handleList = (poke) => (setListOfPoke(poke));
    
    //GET DATA FROM POKEAPI (for now only used for Names)
    //loading on first execution
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=386")  
        .then(response => response.json())  
        .then(pokemon => handleList(pokemon.results))
      }, []);
    
    //Hooks for defining current pokemon and the state of the guessing
    const [numPokemon,setNumPokemon] = useState(rnd_poke);
    const [guessState,setGuessState] = useState(null)
    //Hook state for storing guessed value on the Input element
    const [guessInputValue, setGuessInputValue] = useState("");
    //Hook for img visibility, useful when loading a new img
    const [isVisible, setVisibility] = useState(false)
    //Hooks for points and end/new game
    const [roundErrors, setRoundErrors] = useState(0);
    const [pointsGame, setPointsGame] = useState(0);
    const [round, setRound] = useState(1);
    const [endGame, setEndGame] = useState(false);
    
    //Hooks handlers
    const handlePoke = () => {
                              //setting everything to default and calling a new round
                              //called first time in a new game, and every new round
                              setNumPokemon(rnd_poke);
                              setGuessInputValue("");
                              setGuessState(null);
                              setVisibility(false);
                              handleRound();
                              };
    //updates the state with the value of the input element
    const handleTyping = (event)=> (setGuessInputValue(event.target.value));
    
    const handleGuess = ()=> {
        //checking if our input state === current pokemon state name
        const namePoke = listOfPoke[numPokemon - 1].name
        const isRight = formatGuessStr(guessInputValue).toLowerCase() === formatGuessStr(namePoke).toLowerCase() 
        setGuessState(isRight);
        //if the answer is wrong, call handleRoundErrors to sum 1 to the state
        if (!isRight){handleRoundErrors()}
    };
    
    const handleRoundErrors = () => {
        setRoundErrors(roundErrors => roundErrors + 1)
    }
    //if user skips the current pokemon, this is used to reveal it
    const handleReveal = () => (setRoundErrors(2)) 
    //used for img visibility on loading time
    const handleVisibility = () =>(setVisibility(!isVisible)) 
    //called when finishing the game
    const handleEnd = () =>{
                             setEndGame(true);
                             //on newGame handlePoke calls handleRound which then initializes round to 1
                             setRound(0); 
                            };

    //called when making a new game
    const handleNewGame = () => {
                      handlePoke();
                      setEndGame(false);
                      setPointsGame(0);
    }

    const handleRound = () => {   if (round > 0){
                                     if (guessState) {setPointsGame(pointsGame + (2 - roundErrors))};
                                     setRoundErrors(0);
                                   }
                                  if (round < NUM_ROUNDS) { 
                                        setRound(round + 1);}
                                  else {handleEnd();}
                               };

    return (<div className="main_pokeContainer" style={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        background:"#F93318",
                        margin:"auto",
                        height:"100vh"
                    }}>
              {endGame ? //the game is over, show final screen  
                         <div style={{display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        position:"absolute",
                        top: "50%",
                        gap:"1em",
                        transform: "translate(0, -50%)",
                        textAlign:"center",
                        maxWidth:"45ch"
                        }}>
                            <p style={{fontSize:"1.1em"}}>Terminaste el juego con {pointsGame} puntos. Tuviste {(NUM_ROUNDS*2)-pointsGame} errores</p>
                            <button style={{display:"block", height:"35px", width:"110px"}} onClick={handleNewGame}>Reiniciar</button>
                        </div>               
              : //in-game show img + panel
            <>
            <img src="/logo8bit2.png" alt="pokemon logo" height="100px"></img>
            <PokeImg style={{
                            minWidth:"19.80rem",
                            minHeight:"21.12rem",
                            backgroundColor:"#F93318",
                            backgroundImage:'url("pokebg.png")',
                            backgroundSize:"cover",
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                        }} 
                        num={"https://assets.pokemon.com/assets/cms2/img/pokedex/detail/"+ formatPokeNum(numPokemon) + ".png"} 
                        silhouette={((guessState) || (roundErrors === 2))}
                        onLoad={handleVisibility}
                        visibility={isVisible}/>
            
            <PokePanel
                inputValue={guessInputValue} 
                onType={handleTyping} 
                onReset={handlePoke} 
                onGuess={handleGuess}
                guessValue={guessState}
                attempts={roundErrors}
                setAttempts={handleReveal}
                revealName={listOfPoke.length ? capitalize(formatGuessStr(listOfPoke[numPokemon - 1].name)): ""}/>
            </>}
     </div>)
}

export default PokeMain;