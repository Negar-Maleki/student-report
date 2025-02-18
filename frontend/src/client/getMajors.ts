import { IMajor } from "../studentsModule";
import { API_BASE_URL } from "./config";

const getMajors = async (): Promise<IMajor[] | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/majors`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

export default getMajors;
