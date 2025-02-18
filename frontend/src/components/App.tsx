import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { Button } from "primereact/button";
import StudentDisplay from "./StudentDisplay";
import { API_BASE_URL } from "../client/config";

const AppContainer = styled.div`
  width: max(50%, 48em);
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
  }
`;

function App() {
  interface User {
    username: string;
  }
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Unauthorized");
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  const handleLogout = () => {
    fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
    })
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <AppContainer>
      <header>
        <div>
          {user && <h2>Welcome, {user.username}!</h2>}
          <h1>Student report</h1>
        </div>
        {user ? (
          <Button label="Logout" icon="pi pi-sign-out" onClick={handleLogout} />
        ) : (
          <Button label="Login" icon="pi pi-sign-in" onClick={handleLogin} />
        )}
      </header>
      {user && <StudentDisplay />}
    </AppContainer>
  );
}

export default App;
