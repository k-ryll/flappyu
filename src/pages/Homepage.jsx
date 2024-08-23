import Game from "../components/game";

import { auth } from "../config/firebase"; // Adjust the path as needed
import { signOut } from "firebase/auth";

const Homepage = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully!");
      })
      .catch((error) => {
        console.error(`Error [${error.code}]: ${error.message}`);
      });
  };
  
  return (
    <div>
      <Game/>
      
        <button onClick={handleSignOut}>Sign Out</button>
      
    </div>
  );
}


export default Homepage;