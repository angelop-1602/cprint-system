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
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

interface Column<T> {
  id: keyof T;
  label: string;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  customVariant?: 'primary' | 'secondary' | 'light' | 'dark'; // Ensure the types are correct
  icon?: React.ReactNode; // Add icon property for the button
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  emptyMessage?: string;
  maxHeight?: string;
}

const ReusableTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  emptyMessage,
  maxHeight = '400px',
}: ReusableTableProps<T>) => {
  const theme = useTheme(); // Get the theme object

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight,
        overflowY: 'auto',
        boxShadow: 3, // Add shadow here
        borderRadius: 2, // Optional: round corners
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell 
                key={String(column.id)} 
                align="center" // Center the text in the header
                sx={{
                  backgroundColor: theme.palette.primary.main, // Use the theme for the background color
                  color: theme.palette.primary.contrastText, // Text color
                  fontWeight: 'bold', // Bold text
                  fontSize: '1.2rem', // Make text larger
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {actions && (
              <TableCell 
                align="center" 
                sx={{
                  backgroundColor: theme.palette.primary.main, // Same header color
                  color: theme.palette.primary.contrastText, // Text color
                  fontWeight: 'bold', // Bold text
                  fontSize: '1.2rem', // Make text larger
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.id)}>
                    {String(item[column.id])}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    {actions.map((action, idx) => (
                      <ReusableButton
                        key={action.label}
                        customVariant={action.customVariant || 'primary'}
                        onClick={() => action.onClick(item)}
                        startIcon={action.icon} // Include icon
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
