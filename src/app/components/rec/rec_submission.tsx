// RecSubmission.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import ReusableTable from '../reusable/Table';
import { Routes } from '@/app/route/routes';


interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface RecSubmissionProps {
  tableData: Submission[];
}

const RecSubmission: React.FC<RecSubmissionProps> = ({ tableData }) => {
  const router = useRouter();

  const columns: Column<Submission>[] = [
    { id: 'title', label: 'Research Title' },
    { id: 'status', label: 'Status' },
    { id: 'date', label: 'Date' },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (item: Submission) => router.push(`${Routes.REC}/${item.id}`), // Updated to use Routes
    },
    {
      label: 'Edit',
      onClick: (item: Submission) => router.push(`${Routes.REC_EDIT}?id=${item.id}`), // Updated to use Routes
    },
  ];


  return (
    <ReusableTable
      data={tableData}
      columns={columns}
      actions={actions}
      emptyMessage="No submissions found."
    />
  );
};

export default RecSubmission;
