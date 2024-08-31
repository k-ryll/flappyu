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
    <div className="homepage">
      <button onClick={handleSignOut} className="signout-btn">Sign Out</button> 
      <Game/>
      
        
      
    </div>
  );
}


export default Homepage;