import React, { useEffect, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from "../config/firebase";
import Scores from "../components/scores";

const Game = () => {
  const holeRef = useRef(null);
  const gameRef = useRef(null);
  const resultRef = useRef(null);
  const textRef = useRef(null);
  const birdRef = useRef(null);
  const blockRef = useRef(null);
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const hole = holeRef.current;
    const game = gameRef.current;
    const result = resultRef.current;
    const text = textRef.current;
    const bird = birdRef.current;
    const block = blockRef.current;

    const RanHole = () => {
      const random = Math.floor(Math.random() * (500 - 150 + 1)) - 500;
      hole.style.top = `${random}px`;
      setScore(prevScore => prevScore + 1);
    };

    hole.addEventListener("animationiteration", RanHole);

    const fall = setInterval(() => {
      const birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
      const speed = 2 + score * 0.1;

      if (jumping === 0) {
        bird.style.top = `${birdTop + speed}px`;
      }

      const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
      const holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
      const hTop = 500 + holeTop;

      if (
        birdTop > 450 ||
        (blockLeft < 50 &&
          blockLeft > -50 &&
          (birdTop < hTop || birdTop > hTop + 120))
      ) {
        if (!gameOver) { // Check if the game is already over
          setGameOver(true);
          result.style.display = "block";
          text.innerText = `Your Final score is : ${score}`;
          game.style.display = "none";
          submitScore(score); // Submit score when game ends
        }
      }
    }, 10);

    const hop = () => {
      setJumping(1);
      const birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));

      if (birdTop > 6) {
        bird.style.top = `${birdTop - 60}px`;
      } else {
        bird.style.top = "0";
      }

      setTimeout(() => {
        setJumping(0);
      }, 100);
    };

    const handleKeydown = (event) => {
      if (event.key === ' ') { // Spacebar for jumping
        event.preventDefault(); // Prevent scrolling
        hop();
      }
    };

    const handleTouchStart = () => {
      hop();
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      hole.removeEventListener("animationiteration", RanHole);
      clearInterval(fall);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [score, jumping, gameOver]); // Add gameOver as a dependency

  const submitScore = async (scoreValue) => {
    const currentUser = auth.currentUser;
    const username = currentUser?.displayName || "Anonymous";
    
    try {
      // Fetch the user's existing scores
      const userScoresQuery = query(
        collection(db, "scores"),
        where("username", "==", username)
      );
      
      const userScoresSnapshot = await getDocs(userScoresQuery);
      const userScores = userScoresSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Determine the highest score for the current user
      const highestScore = userScores.length > 0 ? Math.max(...userScores.map(score => score.score)) : 0;
      
      if (scoreValue > highestScore) {
        // Add the new high score
        await addDoc(collection(db, "scores"), {
          username: username,
          score: scoreValue,
          createdAt: serverTimestamp(),
        });
        console.log('New high score submitted successfully');
        
        // Delete all scores lower than the new high score
        for (const userScore of userScores) {
          if (userScore.score < scoreValue) {
            await deleteDoc(doc(db, "scores", userScore.id));
            console.log('Deleted lower score:', userScore.id);
          }
        }
      } else {
        // Optionally, you can handle scenarios where the score is not a new high score
        console.log('Score is not a new high score, not added.');
      }
      
    } catch (error) {
      console.error('Error submitting or deleting scores:', error);
    }
  };
  

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    // Reset positions and styles for the game
    const hole = holeRef.current;
    const game = gameRef.current;
    const bird = birdRef.current;
    const block = blockRef.current;

    hole.style.top = "-500px";
    game.style.display = "block";
    bird.style.top = "0px";
    block.style.left = "100%";
  };

  return (
    <>
      <div id="game" ref={gameRef}>
        <div id="block" ref={blockRef}></div>
        <div id="hole" ref={holeRef}></div>
        <div>
        
          <img src="src/assets/images/angel2.png" alt="" id="bird" ref={birdRef} />
        </div>
      </div>
      <div id="result" ref={resultRef} style={{ display: gameOver ? "block" : "none" }}>
        <span id="text" ref={textRef}></span>
        <h1>GAME OVER</h1>
        <button onClick={restartGame}>RESTART</button>
        <Scores />
      </div>
    </>
  );
};

export default Game;
