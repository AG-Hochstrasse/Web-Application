import React from "react";
import { DataTable, Table } from "@primer/react/experimental";
import { Text, Link as URLLink, RelativeTime, Link } from "@primer/react";

export interface FileObj {
  name: string
  id: string
}

export default function FileList({ files }: { files: FileObj[] }) {
  if (!files || files.length === 0) {
    return <Text>No files available.</Text>;
  }

  return (
    <Table.Container>
      <DataTable
        aria-labelledby="files"
        aria-describedby="uploaded files"
        data={files}
        columns={[
          {
            rowHeader: true,
            header: () => <Text>Name</Text>,
            field: "name",
            renderCell: (file) => <Link>{file.name}</Link>,
          },
          
        ]}
      />
    </Table.Container>
  );
};