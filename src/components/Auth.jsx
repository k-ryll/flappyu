import React, { useState, useEffect } from "react";
import { auth } from "../config/firebase"; // Adjust the path as needed
import { signInAnonymously, updateProfile } from "firebase/auth";
import Homepage from "../pages/Homepage";

export const Auth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [error, setError] = useState(""); // State to hold error messages

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true); // User is signed in
      } else {
        setIsSignedIn(false); // User is signed out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    if (!newUser.trim()) {
      setError("Username cannot be empty");
      return; // Prevent sign in if username is empty
    }

    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously!");
        // Set a display name for the anonymous user
        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: newUser || "Anonymous", // Use the input value or fallback to "Anonymous"
           
          })
          .then(() => {
            console.log("Display name set:", auth.currentUser.displayName);
            setError(""); // Clear any previous error message
            setNewUser("");
          })
          .catch((error) => {
            console.error("Error updating display name:", error);
          });
        }
      })
      .catch((error) => {
        console.error(`Error [${error.code}]: ${error.message}`);
      });
  };

  return (
    <div className="auth">
      {isSignedIn ? (
        <Homepage />
      ) : (
      <div className="login-page">
      <form className="login" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
          <input 
            type="text" 
            placeholder="Username"
            value={newUser}
            onChange={(e) => {
              setNewUser(e.target.value);
              setError(""); // Clear error message when user types
            }}
          />
          <button type="submit" disabled={!newUser.trim()}>Start</button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </form>
      </div>
        
      )}
    </div>
  );
};
