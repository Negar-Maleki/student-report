import { useState, useEffect } from "react";
import styled from "styled-components";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";

import { getStudents } from "../client/getStudentsData";
import getMajors from "../client/getMajors";
import { IStudent, IMajor } from "../studentsModule";

import AddStudentForm from "./AddStudentForm";
import InfoForm from "./InfoForm";
import StudentTable from "./StudentTable";
import FileUploadForm from "./FileUploadForm";

const StyledSearchContainer = styled.div`
  margin: 1em 0;
  display: flex;
  justify-content: space-between;
  gap: 1em;
  Button {
    margin: 0.5em;
  }
`;

const StyledSwitch = styled.div`
  display: flex;
  gap: 1em;
  justify-content: flex-start;
  margin-top: 2em;
  font-weight: 700;
`;
function StudentDisplay() {
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [addStudentFormVisible, setAddStudentFormVisibility] = useState(false);
  const [fileUploadFormVisible, setFileUploadFormVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentsData, setStudentsData] = useState<IStudent[]>([]);
  const [checked, setChecked] = useState(false);
  const [majorsData, setMajorsData] = useState<IMajor[]>([]);

  useEffect(() => {
    const getMajorsData = async () => {
      try {
        const data = await getMajors();
        if (data) {
          setMajorsData(data);
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };
    getMajorsData();
  }, []);
  useEffect(() => {
    const getData = async (searchValue: string) => {
      try {
        setLoading(true);

        const newData = await getStudents(searchValue);
        if (newData) {
          setStudentsData(Array.isArray(newData) ? newData : [newData]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    getData(searchValue);
  }, [searchValue]);

  const handleEditForm = (e: InputSwitchChangeEvent) => {
    e.preventDefault();

    setChecked(e.value);
  };

  return (
    <>
      <StyledSearchContainer>
        <div>
          <Dropdown
            value={selectedStudent}
            options={studentsData}
            optionLabel="full_name"
            onChange={(e) => {
              setSelectedStudent(e.value);
            }}
            filter={true}
            loading={loading}
            placeholder="Select an option"
          />
        </div>
        <div>
          <Button
            tooltip="Add a new student"
            onClick={() => setAddStudentFormVisibility(true)}
            icon="pi pi-plus"
          />
          <Dialog
            header="َAdd a new student"
            visible={addStudentFormVisible}
            maximizable
            dismissableMask={true}
            style={{ width: "20vw" }}
            onHide={() => {
              if (!addStudentFormVisible) return;
              setAddStudentFormVisibility(false);
            }}
          >
            <AddStudentForm majorsData={majorsData} />
          </Dialog>
          <Button
            tooltip="Upload a file"
            onClick={() => setFileUploadFormVisibility(true)}
            icon="pi pi-upload"
          />
          <Dialog
            onHide={() => {
              if (!fileUploadFormVisible) return;
              setFileUploadFormVisibility(false);
            }}
            visible={fileUploadFormVisible}
            header="Upload a file"
            dismissableMask={true}
          >
            <FileUploadForm />
          </Dialog>
        </div>
      </StyledSearchContainer>

      {selectedStudent && (
        <>
          <StyledSwitch>
            {checked ? "Edit" : "View"} Info
            <InputSwitch checked={checked} onChange={handleEditForm} />
          </StyledSwitch>
          <InfoForm
            studentId={
              selectedStudent.student_id ? selectedStudent.student_id : 0
            }
            checked={checked}
            setChecked={setChecked}
            majorsData={majorsData}
          />
        </>
      )}

      {!selectedStudent && <StudentTable majorsData={majorsData} />}
    </>
  );
}

export default StudentDisplay;
