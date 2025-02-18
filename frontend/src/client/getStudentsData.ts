import { IStudent } from "../studentsModule";
import { API_BASE_URL } from "./config";

async function getAllStudentsData(
  pageNum: number,
  rowsPerPage: number
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home?page=${pageNum + 1}&pageSize=${rowsPerPage}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

async function getStudents(name: string): Promise<IStudent | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/students?full_name=${name}`, {
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
}

async function getStudent(id: number): Promise<IStudent | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

async function addStudent(
  studentData: IStudent
): Promise<IStudent | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating student:", error);
  }
}

async function updateStudentData(studentData: IStudent): Promise<IStudent> {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

async function deleteStudent(studentId: number) {
  console.log(studentId);
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

export {
  getAllStudentsData,
  deleteStudent,
  addStudent,
  getStudent,
  getStudents,
  updateStudentData,
};
