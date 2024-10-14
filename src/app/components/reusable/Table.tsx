// ReusableTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ReusableButton from './Button';

interface Column<T> {
  id: keyof T; // The key of the data item
  label: string; // Display label for the column
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Array<{ label: string; onClick: (item: T) => void }>;
  emptyMessage?: string;
}

const ReusableTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  emptyMessage,
}: ReusableTableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.id)}>{column.label}</TableCell>
            ))}
            {actions && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.id)}>
                    {String(item[column.id])} {/* Ensure it's renderable */}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    {actions.map((action, idx) => (
                      <ReusableButton
                        key={action.label}
                        customVariant={idx === 0 ? 'primary' : 'secondary'} // Primary for first button, secondary for others
                        onClick={() => action.onClick(item)}
                        sx={{ marginRight: 1 }} // Optional spacing
                      >
                        {action.label}
                      </ReusableButton>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                {emptyMessage || 'No data available'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;
