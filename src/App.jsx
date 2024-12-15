import React, { useEffect, useRef, useState } from "react";
import Auth from "./components/Auth";
import { db } from "./config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

function App() {
    const [movies, setMovies] = useState([]);
    const moviesRef = collection(db, "movies"); // db and the name of the collection in the firestore
    const titleRef = useRef("");
    const releaseRef = useRef(0);
    const [isOscar, setIsOscar] = useState(false);
    const newTitleRef = useRef("");

  //   const getMovies = async () => {
  //     try {
  //         const data = await getDocs(moviesRef);
  //         const filteredData = data.docs.map((doc) => ({
  //             ...doc.data(),
  //             id: doc.id,
  //         }));
  //         setMovies(filteredData);
  //     } catch (err) {
  //         console.error(err);
  //     }
  // };

    useEffect(() => {
      const unsubscribe = onSnapshot(moviesRef, (snapshot) => {
        // This will be triggered whenever there's a change in the "movies" collection
        setMovies(snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })));
    });

    return () => unsubscribe();
    }, []);

    async function deleteMovie(id){
      try{
        const movieDoc = doc(db, "movies", id);
        await deleteDoc(movieDoc);
      } catch(err){
        console.error(err);
      }
    }

    async function onAddMovie(){
      const title = titleRef.current.value;
      const releaseDate = +releaseRef.current.value;
      const hasOscar = isOscar;
      try{
        await addDoc(moviesRef, {title, releaseDate, hasOscar});
      } catch(err){
        console.error(err);
      }
    }

    async function updateMovie(id){
      try{
        const movieDoc = doc(db, "movies", id);
        await updateDoc(movieDoc, {title: newTitleRef.current.value});
      } catch(err){
        console.error(err);
      }
    }

    return (
        <>
            <Auth />

            <div>
              <input type="text" ref={titleRef} placeholder="Enter movie title" />
              <input type="number" ref={releaseRef} placeholder="Enter release date" min={2000} />
              <label htmlFor="oscar">Has Oscar</label>
              <input type="checkbox" checked={isOscar} onChange={e => setIsOscar(e.target.checked)} id="oscar" />
              <button onClick={onAddMovie}>Submit movie</button>
            </div>

            <div>
              {movies?.map(movie => {
                return <div key={movie.id}>
                  <h1 style={{color: movie.hasOscar ? "red" : "green"}}>{movie.title}</h1>
                  <p>Date: {movie.releaseDate}</p>
                  <button onClick={() => deleteMovie(movie.id)}>Delete</button>
                  
                  <input type="text" placeholder="Enter new title" ref={newTitleRef} />
                  <button onClick={() => updateMovie(movie.id)}>Change title</button>

                </div>
              })}
            </div>
        </>
    );
}

export default App;
