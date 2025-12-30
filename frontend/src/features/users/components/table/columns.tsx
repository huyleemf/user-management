import { Avatar, Box, Checkbox, Input, Stack, Typography } from "@mui/material";
import type { User } from "../../api/types";
import { type ColumnDef } from "@tanstack/react-table";
import SearchIcon from "@mui/icons-material/Search";
import { Activity } from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { stringAvatar } from "../../utils/utils";
export const columns: ColumnDef<User>[] = [
  {
    id: "select",
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
    header: () => (
      <div>
        <Input
          placeholder="Search by name/email"
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
                children={<AssignmentIndIcon />}
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
        <Typography color="textSecondary" fontSize={16} variant="body1">
          {row.original.role}
        </Typography>
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
