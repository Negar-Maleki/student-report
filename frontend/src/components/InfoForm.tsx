import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IStudent } from "../studentsModule";

import {
  getStudent,
  deleteStudent,
  updateStudentData,
} from "../client/getStudentsData";

import { ToggleButtonChangeEvent } from "primereact/togglebutton";
import { InputText } from "primereact/inputtext";
import { formatDate } from "../utils/helper";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import StudentTable from "./StudentTable";

const StyledForm = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 1em;
  align-items: center;

  label {
    width: 6em;
  }
`;
const StyledInput = styled(InputText)`
  width: 15em;
`;

const StyledDropdown = styled(Dropdown)`
  width: 15em;
`;
const StyledRadioButton = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6em;
`;
const StyledButtons = styled.div`
  display: flex;
  gap: 1em;
  justify-content: flex-end;
  margin-top: 1em;
`;

function InfoForm(props: {
  studentId: number;
  majorsData: any;
  checked: boolean;
  setChecked: any;
}) {
  const [studentData, setStudentData] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectGender, setSelectGender] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<number | null>(null);
  const [deletingStudent, setDeletingStudent] = useState(false);
  const deletingToast = useRef<Toast | null>(null);
  const updatingToast = useRef<Toast | null>(null);

  useEffect(() => {
    const getStudentData = async () => {
      try {
        setLoading(true);

        const data = await getStudent(props.studentId);
        if (data) {
          setStudentData(data);

          setSelectedMajor(data.major_id ?? 0);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    getStudentData();
  }, [props.studentId]);

  const handleDelete = () => {
    const deleteData = async () => {
      try {
        const data = await deleteStudent(props.studentId);
        console.log(data);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    };
    deleteData();
    setDeletingStudent(true);
    deletingToast.current?.show({
      severity: "error",
      summary: "Deleted successfully",
      detail: `${studentData?.full_name ?? "Unknown"} with ID ${
        props.studentId
      } successfully deleted.`,
      life: 3000,
    });
  };

  const handleUpdateInfo = (e: ToggleButtonChangeEvent) => {
    const updateInfo = async () => {
      try {
        if (studentData) {
          const data = await updateStudentData(studentData);
          console.log(data);
        } else {
          console.error("Student data is null");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    };
    updateInfo();

    props.setChecked(e.value);

    updatingToast.current?.show({
      severity: "success",
      summary: "Success",
      detail: `${studentData?.full_name ?? "Unknown"} with ID ${
        props.studentId
      } successfully updated.`,
      life: 3000,
    });
  };

  const handleMajors = (e: { value: any }) => {
    if (studentData) {
      console.log(e.value);
      setSelectedMajor(e.value.major);
      setStudentData({
        ...studentData,
        major_id: e.value.major_id,
      } as IStudent);
    }
  };

  return (
    <>
      {!deletingStudent ? (
        <>
          <StyledForm>
            <label htmlFor="fullName">Full Name </label>
            <StyledInput
              id="fullName"
              value={studentData?.full_name ? studentData?.full_name : ""}
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  full_name: e.target.value,
                } as IStudent)
              }
              disabled={!props.checked}
            />
            <label htmlFor="gender">Gender </label>
            {props.checked ? (
              <StyledRadioButton>
                <div>
                  <label htmlFor="male">Male </label>
                  <RadioButton
                    inputId="male"
                    name="gender"
                    value="Male"
                    checked={selectGender === "Male"}
                    disabled={!props.checked}
                    onChange={(e) => {
                      setSelectGender(e.value);
                      setStudentData({
                        ...studentData,
                        gender: e.target.value,
                      } as IStudent);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="female">Female </label>
                  <RadioButton
                    inputId="female"
                    name="gender"
                    value="Female"
                    onChange={(e) => {
                      setSelectGender(e.value);
                      setStudentData({
                        ...studentData,
                        gender: e.target.value,
                      } as IStudent);
                    }}
                    checked={selectGender === "Female"}
                    disabled={!props.checked}
                  />
                </div>
              </StyledRadioButton>
            ) : (
              <StyledInput
                id="gender"
                value={studentData?.gender === "M" ? "Male" : "Female"}
                disabled={!props.checked}
              />
            )}
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <StyledInput
              id="dateOfBirth"
              value={
                studentData && studentData.date_of_birth
                  ? formatDate(new Date(studentData.date_of_birth))
                  : ""
              }
              disabled={!props.checked}
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  date_of_birth: formatDate(new Date(e.target.value)),
                } as IStudent)
              }
            />
          </StyledForm>
          <StyledForm>
            <label htmlFor="studentId">Student ID </label>
            <StyledInput
              id="studentId"
              value={studentData?.student_id?.toString() ?? ""}
              disabled={!props.checked}
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  student_id: Number(e.target.value),
                } as IStudent)
              }
            />
            <label htmlFor="major">Major </label>
            <StyledDropdown
              value={selectedMajor ?? ""}
              onChange={handleMajors}
              options={props.majorsData}
              optionLabel="major"
              placeholder={selectedMajor?.toString() ?? "Select a Major"}
              disabled={!props.checked}
            />

            <label htmlFor="cohortYear">Cohort Year </label>
            <StyledInput
              id="cohortYear"
              value={studentData?.cohort_year?.toString() ?? ""}
              disabled={!props.checked}
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  cohort_year: Number(e.target.value),
                } as IStudent)
              }
            />
          </StyledForm>
          <StyledButtons>
            <Toast ref={updatingToast} />
            <ToggleButton
              onLabel="Submit"
              offLabel="Info Submitted"
              onIcon="pi pi-user-edit"
              offIcon="pi pi-check"
              checked={props.checked}
              onChange={handleUpdateInfo}
              className="w-9rem"
              disabled={props.checked === false}
            />
            <Toast ref={deletingToast} />
            <Button
              icon="pi pi-trash"
              label="Delete"
              severity="danger"
              onClick={handleDelete}
              disabled={deletingStudent}
            />
          </StyledButtons>
        </>
      ) : (
        <StudentTable majorsData={props.majorsData} />
      )}
    </>
  );
}

export default InfoForm;
