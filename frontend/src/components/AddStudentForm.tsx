import { useRef, useState } from "react";
import styled from "styled-components";

import { addStudent } from "../client/getStudentsData";

import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { IMajor } from "../studentsModule";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const StyledButton = styled(Button)`
  width: 10em;
  align-self: flex-end;
`;

interface AddStudentFormProps {
  majorsData: IMajor[];
}

function AddStudentForm({ majorsData, ...props }: AddStudentFormProps) {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [major, setMajor] = useState<IMajor | null>(null);
  const [cohortYear, setCohortYear] = useState<Date | null>(null);
  const [gender, setGender] = useState("F");
  const [newStudentSubmited, setNewStudentSubmited] = useState(false);

  const submitToast = useRef<Toast | null>(null);

  const newStudent = {
    full_name: name,
    major_id: major?.major_id || null,
    date_of_birth: birthDate || null,
    gender: gender,
    cohort_year: Number(cohortYear?.getFullYear()) || null,
  };

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const addNewStudent = async () => {
      try {
        const data = await addStudent(newStudent);
        console.log(data);

        submitToast.current?.show({
          severity: "success",
          summary: "New student successfully created ",
          detail: `${newStudent?.full_name} successfully created.`,
          life: 3000,
        });
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    };
    addNewStudent();
    setNewStudentSubmited(true);
  }
  const genders = [
    {
      gender: "Female",
      code: "F",
    },
    {
      gender: "Male",
      code: "M",
    },
  ];

  return (
    <>
      {!newStudentSubmited ? (
        <StyledForm className="p-fluid" onSubmit={handleFormSubmit}>
          <div className="p-field">
            <label htmlFor="name">Full Name</label>
            <InputText
              value={name}
              id="full_name"
              type="text"
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="major">Major</label>

            <Dropdown
              options={majorsData}
              optionLabel="major"
              value={major}
              onChange={(e) => setMajor(e.value)}
              placeholder="Select major"
            />
          </div>
          <div className="p-field">
            <label htmlFor="gender">Gender</label>
            <Dropdown
              options={genders}
              optionLabel="gender"
              value={gender}
              onChange={(e) => setGender(e.value.code)}
              placeholder="Select gender"
            />
          </div>

          <div className="p-field">
            <label htmlFor="cohort_year">Cohort Year</label>
            <Calendar
              value={cohortYear}
              view="year"
              dateFormat="yy"
              onChange={(e) => {
                setCohortYear(e.value ?? null);
                console.log(e.value);
              }}
              required={true}
            />
          </div>

          <div className="p-field">
            <label htmlFor="birthDate">Birth Date</label>
            <Calendar
              id="birthDate"
              dateFormat="yy-mm-dd"
              value={birthDate}
              onChange={(e) => setBirthDate(e.value ?? null)}
              required={true}
            />
          </div>
          <Toast ref={submitToast} />
          <StyledButton label="Submit" />
        </StyledForm>
      ) : (
        <div>Student successfully added</div>
      )}
    </>
  );
}

export default AddStudentForm;
