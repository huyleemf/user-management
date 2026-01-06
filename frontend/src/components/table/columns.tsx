import type { User } from "@/data/users/types";
import { stringAvatar } from "@/utils/utils";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import { type ColumnDef } from "@tanstack/react-table";
import { Activity } from "react";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    maxSize: 10,
    header: () => (
      <Checkbox
        // checked={
        //   table.getIsAllPageRowsSelected() ||
        //   (table.getIsSomePageRowsSelected() && "indeterminate")
        // }
        // onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    filterFn: (row, _, filterValue) => {
      const username = row.original.username?.toLowerCase() ?? "";
      const email = row.original.email?.toLowerCase() ?? "";
      const searchValue = filterValue?.toLowerCase() ?? "";

      return username.includes(searchValue) || email.includes(searchValue);
    },
    header: ({ table }) => (
      <div>
        <Input
          placeholder="Search by name/email"
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          startAdornment={
            <SearchIcon
              style={{
                marginInlineEnd: 4,
              }}
            />
          }
          disableUnderline
        />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Avatar {...stringAvatar(row.original.username)} />
          <Box>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Typography variant="body1" fontWeight={500}>
                {row.original.username}
              </Typography>
              <Activity
                name="isManager"
                mode={row.original.role == "MANAGER" ? "visible" : "hidden"}
                children={
                  <IconButton>
                    <AssignmentIndIcon />
                  </IconButton>
                }
              />
            </Stack>
            <Typography
              fontSize={14}
              variant="subtitle1"
              style={{
                color: "GrayText",
              }}
            >
              {row.original.email}
            </Typography>
          </Box>
        </Stack>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <Typography
        variant="body1"
        fontSize={16}
        color="textSecondary"
        fontWeight={600}
      >
        Role
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <Chip variant="filled" label={row.original.role} color="primary" />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <Typography
        variant="body1"
        fontSize={16}
        color="textSecondary"
        fontWeight={600}
      >
        Created At
      </Typography>
    ),
    cell: ({ row }) => {
      return (
        <Typography color="textSecondary" fontSize={16} variant="body1">
          {new Date(row.original.createdAt)?.toLocaleDateString() ?? ""}
        </Typography>
      );
    },
  },
];
