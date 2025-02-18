import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { formatDate } from "../utils/helper";
import { getAllStudentsData } from "../client/getStudentsData";

import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";

import { IStudent } from "../studentsModule";

interface Data {
  results: IStudent[];
  totalCount: number;
}

interface MajorsData {
  majorsData: { major_id: number; major: string }[];
}

function StudentTable(props: MajorsData) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>({ results: [], totalCount: 0 });
  const [pageSize, setPageSize] = useState(5);
  const [first, setFirst] = useState(0);

  const onNextPage = async (page = 0, pageSize = 5) => {
    try {
      setLoading(true);
      const newData = await getAllStudentsData(page, pageSize);
      setData(newData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onNextPage();
  }, []);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    onNextPage(event.page, event.rows);
    setFirst(event.first);
    setPageSize(event.rows);
  };

  const studentData = data?.results;

  const majorName = (rowData: IStudent) => {
    const major = props.majorsData.find(
      (major) => major.major_id === rowData.major_id
    );
    return major?.major;
  };

  const formatedBirthDate = (rowData: IStudent) => {
    return formatDate(
      rowData.date_of_birth ? new Date(rowData.date_of_birth) : null
    );
  };

  return (
    <div className="card">
      <DataTable value={studentData} tableStyle={{ minWidth: "50rem" }}>
        <Column
          field="full_name"
          header="Name"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="cohort_year"
          header="Cohort Year"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="date_of_birth"
          header="Date of Birth"
          body={formatedBirthDate}
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="major_id"
          header="Major"
          body={majorName}
          style={{ width: "25%" }}
        ></Column>
      </DataTable>

      <div className="card">
        <Paginator
          first={first}
          rows={pageSize}
          totalRecords={data.totalCount}
          rowsPerPageOptions={[5, 10, 15]}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default StudentTable;
