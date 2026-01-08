import { getTeam } from "@/data/teams";
import type { GetTeamsResponse } from "@/data/teams/types";
import { fetchUserTeams } from "@/data/users";
import type { User, UserTeams } from "@/data/users/types";
import { useAuthorization } from "@/shared/utils/roles";
import { storage } from "@/shared/utils/storage";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import StatsCard from "./components/StatsCard";

interface DashboardStats {
  totalTeams: number;
  teamsAsLeader: number;
  totalMembersManaged: number;
  largestTeam: {
    name: string;
    size: number;
  } | null;
  averageTeamSize: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user: User | null = storage.get("user");
  const { isManager } = useAuthorization();

  const [teams, setTeams] = useState<UserTeams[]>([]);
  const [detailedTeams, setDetailedTeams] = useState<GetTeamsResponse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    teamsAsLeader: 0,
    totalMembersManaged: 0,
    largestTeam: null,
    averageTeamSize: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calculateStats = useCallback(
    (
      userTeams: UserTeams[],
      teamDetails: GetTeamsResponse[]
    ): DashboardStats => {
      const totalTeams = userTeams.length;

      const teamsAsLeader = teamDetails.filter(
        (team) => team.teamLeader?.userId === user?.userId
      ).length;

      let totalMembersManaged = 0;
      teamDetails.forEach((team) => {
        totalMembersManaged +=
          (team.managers?.length || 0) + (team.members?.length || 0);
      });

      let largestTeam: { name: string; size: number } | null = null;
      teamDetails.forEach((team) => {
        const teamSize =
          (team.managers?.length || 0) + (team.members?.length || 0);
        if (!largestTeam || teamSize > largestTeam.size) {
          largestTeam = {
            name: team.teamName,
            size: teamSize,
          };
        }
      });

      const averageTeamSize =
        totalTeams > 0 ? Math.round(totalMembersManaged / totalTeams) : 0;

      return {
        totalTeams,
        teamsAsLeader,
        totalMembersManaged,
        largestTeam,
        averageTeamSize,
      };
    },
    [user]
  );

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userTeams = await fetchUserTeams(user!.userId);
      if (!userTeams) {
        setTeams([]);
        setLoading(false);
        return;
      }

      setTeams(userTeams);

      const teamDetailsPromises = userTeams.map((team) => getTeam(team.teamId));
      const teamDetails = await Promise.all(teamDetailsPromises);
      setDetailedTeams(teamDetails);

      const calculatedStats = calculateStats(userTeams, teamDetails);
      setStats(calculatedStats);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, calculateStats]);

  useEffect(() => {
    if (user?.userId) {
      loadDashboardData();
    }
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
          height={400}
        >
          <CircularProgress />
          <Typography>Loading dashboard...</Typography>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.username}! Here's an overview of your teams.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              startIcon={<GroupsIcon />}
              onClick={() => navigate("/teams")}
            >
              View All Teams
            </Button>
            {isManager && (
              <Button
                variant="outlined"
                startIcon={<EngineeringIcon />}
                onClick={() => navigate("/managers")}
              >
                View All Managers
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/members")}
            >
              View All Members
            </Button>
          </Stack>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <StatsCard
              icon={<GroupsIcon fontSize="large" />}
              title="Total Teams"
              value={stats.totalTeams}
              subtitle="Teams you belong to"
              color="primary.main"
              onClick={() => navigate("/teams")}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <StatsCard
              icon={<LeaderboardIcon fontSize="large" />}
              title="Teams as Leader"
              value={stats.teamsAsLeader}
              subtitle="Where you're the leader"
              color="success.main"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <StatsCard
              icon={<PeopleIcon fontSize="large" />}
              title="Members Managed"
              value={stats.totalMembersManaged}
              subtitle="Total across all teams"
              color="info.main"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <StatsCard
              icon={<DashboardIcon fontSize="large" />}
              title="Avg Team Size"
              value={stats.averageTeamSize}
              subtitle="Average members per team"
              color="warning.main"
            />
          </Grid>
        </Grid>

        {/* Largest Team Highlight */}
        {stats.largestTeam && (
          <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Largest Team
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "secondary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="secondary.main"
                >
                  {stats.largestTeam.size}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {stats.largestTeam.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.largestTeam.size} total members
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Recent Teams Table */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Your Teams
          </Typography>
          {teams.length === 0 ? (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 6, textAlign: "center" }}
            >
              <GroupsIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Teams Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {isManager
                  ? "Create your first team to get started"
                  : "You haven't been added to any teams yet"}
              </Typography>
              {isManager && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/teams")}
                >
                  Create Team
                </Button>
              )}
            </Paper>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Team Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Members
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Leader</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailedTeams.map((team) => (
                    <TableRow key={team.teamId} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {team.teamName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {(team.managers?.length || 0) +
                            (team.members?.length || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {team.teamLeader?.username || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate("/teams")}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default Dashboard;
