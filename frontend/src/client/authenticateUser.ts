import { API_BASE_URL } from "./config";

async function authenticateUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/login`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error login:", error);
  }
}

export default authenticateUser;
