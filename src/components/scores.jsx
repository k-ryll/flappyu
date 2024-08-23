import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from "../config/firebase";

const Scores = () => {
  const [scores, setScores] = useState([]);
  const scoresRef = collection(db, "scores");

  useEffect(() => {
    const queryScores = query(scoresRef, orderBy("score", "desc"));
    const unsubscribe = onSnapshot(queryScores, (snapshot) => {
      let scoresArray = [];
      snapshot.forEach((doc) => {
        scoresArray.push({ ...doc.data(), id: doc.id });
      });
      setScores(scoresArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>High Scores</h2>
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
