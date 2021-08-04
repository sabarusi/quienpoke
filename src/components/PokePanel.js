import React  from 'react';

const PokePanel = ({onReset, onGuess, onType, inputValue, guessValue, attempts, setAttempts, revealName}) => {    
    const revealPoke = (guessValue) || (attempts === 2);

    return <div className="box_8bit">
                <div className="wrapper"  
                     style={{display:"flex", 
                            flexDirection:"column",
                            padding:"2rem", 
                            background:"#ffcb05",
                            textAlign:"center", 
                            fontSize:"0.9rem", 
                            color:"black"}}>
                        {!revealPoke ? 
                                  <input style={{height:"30px", 
                                                 maxWidth:"80%", 
                                                 fontSize:"0.8em",
                                                 textAlign:"center",
                                                 margin:"auto",
                                                 outline: guessValue === false ? "solid 3px red" : "solid 1px black"}}
                                        type="text" 
                                        value={inputValue} 
                                        onChange={onType} />
                                : "¡Es "+ revealName + "!"}
                <div style={{display:"flex",
                            gap:"1em", 
                            marginTop:"1.5em", 
                            justifyContent:"center"}}>
                    <button style={{width:"120px",
                                height:"40px"}} 
                                type="button" 
                                onClick={revealPoke ? onReset : setAttempts}>
                                        {revealPoke ? "Siguiente" : "Revelar"}
                    </button>
                    
                    <button style={{width:"120px", 
                                    height:"40px"}} 
                                    type="button" 
                                    disabled={revealPoke} 
                                    onClick={onGuess}>
                                                    Adivinar
                    </button>
                </div>
        </div>
    </div> 
}

export default PokePanel;