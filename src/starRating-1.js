import { useState } from "react";
import propTypes from "prop-types";


// S.propTypes = {
//   size: propTypes.string,
// }

// export function StarRating() {
  
//   return (
//     <div>
//       <S width="50px" height="50px" color="green" size="48px" defaultRating={2}/>
//       <S width="50px" height="50px" color="red" size="30px"  defaultRating={1}/>
//       <S width="60px" height="75px" color="orange" size="30px" messages={["poor", "Good", "Amazing!"] }/>
      
//     </div>
//   )
// }
export function StarRating({width, height, color, size, maxRating = 3, messages = [], defaultRating = 0} ){
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(r){
    setRating(r)
  }
  
  return (
    <div className="rating">
      <div>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star onMouseIn={() =>
            setTempRating(i+1)
          }
          onMouseOut={() => setTempRating(0)}
          onRating={() => handleRating(i+1)}
          fill={tempRating ? tempRating >= i+1 : rating >= i+1}
          width={width}
          height={height}
          color={color}
          size={size}
        
          />
        ))}
      </div>
      <p>{ ( messages.length === maxRating) ? ( messages[ tempRating ? tempRating -1 : rating -1]) : tempRating || rating || ""}</p>
    </div>
  );
}

// const starStyling = {
//     background: 'blue', padding: '1rem'
// }

function Star({ onMouseIn, onMouseOut, onRating , fill, size = "48px", color = "red", width = "25px", height = "25px"}) {
  

  return (
    <span

      onClick={onRating}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
    >
    {fill ?
    <svg style={{color: color}} xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
    
    :
      <svg style={{color: color}} xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
  </svg>
    }
    </span>
  );
}
      