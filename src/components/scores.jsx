import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from "../config/firebase";

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const scoresRef = collection(db, "scores");

  useEffect(() => {
    const queryScores = query(scoresRef, orderBy("score", "desc"));

    // Subscribe to the scores collection
    const unsubscribe = onSnapshot(
      queryScores,
      (snapshot) => {
        let scoresArray = [];
        snapshot.forEach((doc) => {
          scoresArray.push({ ...doc.data(), id: doc.id });
        });
        setScores(scoresArray);
        setLoading(false); // Data loaded successfully
      },
      (error) => {
        console.error("Error fetching scores:", error);
        setError(error); // Set error if there's an issue
        setLoading(false); // Data loading finished (with error)
      }
    );

    // Clean up subscription on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading scores...</p>; // Loading state
  }

  if (error) {
    return <p>Error loading scores: {error.message}</p>; // Error handling
  }

  return (
    <div className='leader board'>
      <h2>Leader Board</h2>
      {scores.length > 0 ? (
        scores.map((score) => (
          <div key={score.id}>
            <h3>{score.username}: {score.score}</h3>
          </div>
        ))
      ) : (
        <p>No scores available</p>
      )}
    </div>
  );
};

export default Scores;
