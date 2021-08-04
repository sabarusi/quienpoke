import React from 'react'

const PokeImg = ({style, num, silhouette, onLoad, visibility}) => {
    const img_display = visibility ? "block" : "none";
    const img_brightness = silhouette ? "100%" : "0%";
    return (
            <div className="pokeimg_container" style={style}>
                <img src={num} 
                     onLoad={onLoad} 
                     style={{filter:"brightness("+ img_brightness+")",
                             display:img_display, 
                             width:"15rem", 
                             height:"15rem"}} 
                     alt="Pokémon silhouette"/>
             </div>
    )
}

export default PokeImg;
