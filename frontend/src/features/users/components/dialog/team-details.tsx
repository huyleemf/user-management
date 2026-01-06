import type { AppDispatch, RootState } from "@/redux/store";
import { Chip, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/slice";
interface UserTeamsChipsProps {
  userId: string;
}
const UserTeamsChips: React.FC<UserTeamsChipsProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { userTeam } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(userActions.fetchUserTeamsRequested(userId));
  }, [dispatch, userId]);

  return (
    <React.Fragment>
      <Stack
        sx={{
          cursor: "pointer",
          "*:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        direction={"row"}
        alignItems="center"
        gap={1}
      >
        {!!userTeam &&
          userTeam.length > 0 &&
          userTeam
            .slice(0, 3)
            .map((team) => (
              <Chip
                key={team.teamId}
                color="primary"
                sx={{ borderRadius: 0 }}
                label={team.teamName}
              />
            ))}
        {!!userTeam && userTeam.length > 3 && (
          <Chip
            size="small"
            label={`+${userTeam.length - 3} more`}
            color="primary"
            sx={{ borderRadius: 0 }}
          />
        )}
      </Stack>
    </React.Fragment>
  );
};

export default UserTeamsChips;
