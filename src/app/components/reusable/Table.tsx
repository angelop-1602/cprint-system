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
import { useTheme } from '@mui/material/styles';

interface Column<T> {
  id: keyof T;
  label: string;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  customVariant: 'primary' | 'secondary' | 'light' | 'dark'; // Ensure this matches your expected variants
  icon: React.ReactNode;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  emptyMessage?: string;
  maxHeight?: string;
}
// Table.tsx
interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  customVariant: 'primary' | 'secondary' | 'light' | 'dark'; // Enforced strict type
  icon: React.ReactNode;
}

const ReusableTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  emptyMessage,
  maxHeight = '400px',
}: ReusableTableProps<T>) => {
  const theme = useTheme();

  // Helper function to render table cells
  const renderCell = (item: T, columnId: keyof T) => {
    const cellValue = item[columnId];
    return cellValue !== undefined ? String(cellValue) : '';
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight,
        overflowY: 'auto',
        overflowX: 'auto',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Table stickyHeader sx={{ minWidth: '600px' }} role="table">
        <TableHead>
          <TableRow>
            {columns.map(({ id, label }) => (
              <TableCell
                key={String(id)}
                align="center"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                {label}
              </TableCell>
            ))}
            {actions && (
              <TableCell
                align="center"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id || item.name || item.label}> {/* Use a unique identifier here */}
                {columns.map(({ id }) => (
                  <TableCell key={String(id)}>
                    {renderCell(item, id)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    {actions.map((action) => (
                      <ReusableButton
                        key={action.label}
                        customVariant={action.customVariant || 'primary'}
                        onClick={() => action.onClick(item)}
                        startIcon={action.icon}
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
