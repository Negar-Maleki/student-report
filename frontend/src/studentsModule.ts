export interface IMajor {
  major_id: number;
  major: string;
}

export interface IStudent {
  full_name: string;
  major_id: number | null;
  date_of_birth: Date | null;
  gender: string;
  student_id?: number | null;
  cohort_year: number | null;
}
