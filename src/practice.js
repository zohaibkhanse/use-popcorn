import { useEffect, useState } from "react"

let cateArray = [];
export default function Practice(){
    const [isLoading, setIsLoading] = useState(false);
    useEffect(function(){
        async function cates(){
            try{
                setIsLoading(true);
                const res  = await fetch("https://api.thecatapi.com/v1/images/search?limit=10");
                const data = await res.json();
                cateArray = data;
                console.log(data);
                setIsLoading(false);
            }catch(error){
                console.log(error.message);
            }

        }
        cates();
    }, [])


    return (
        <div className="cates-container">
        { isLoading ? <Loader /> :
            cateArray.map((el, i) => <Image data={el} imageNumber={i+1} key={el.id}  />)}
        </div>
    )
}

function Image({data, imageNumber}){
    return (<div className="cate-image">
        <img className="cate-image__image" src={data.url} alt={data.id} />
        <h2>Image Number {imageNumber}</h2>
    </div>)
}

function Loader(){
    return (
        <h2>
           wait images loading...
        </h2>
    )
}