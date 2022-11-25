import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";
import PageWrapper from "@/components/page-wrapper";
import { Process } from "@/lib/types";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { useState } from "react";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons";

// interface ProcessComponentProps {
//   process: Process;
// }
// const ProcessComponent: React.FC<ProcessComponentProps> = ({ process }) => {
//   return (
//     <Card shadow={"lg"} p="sm" radius={"md"} withBorder>
//       <Group position="apart">
//         <Group>
//           <h3>{process.name}</h3>
//           <p>PID: {process.pid}</p>
//           <p>Memory Usage: {process.memoryUsage}</p>
//           <p>CPU Usage: {process.cpuUsage}</p>
//           <p>Status: {process.status}</p>
//         </Group>
//         <Group position="right">
//           <Button color={"red"}>Kill</Button>
//         </Group>
//       </Group>
//     </Card>
//   );
// };
///////////////////////////////////////////

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface TableSortProps {
  processes: Process[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const Th: React.FC<ThProps> = ({ children, reversed, sorted, onSort }) => {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
};

const filterData = (data: Process[], search: string) => {
  if (!search) return data;
  return data.filter((item) =>
    keys(item).some((key) =>
      String(item[key]).toLowerCase().includes(search.toLowerCase())
    )
  );
};

const sortData = (
  data: Process[],
  payload: { sortBy: keyof Process | null; reversed: boolean; search: string }
) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
};

const TableSort: React.FC<TableSortProps> = ({ processes }) => {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(processes);
  const [sortBy, setSortBy] = useState<keyof Process | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof Process) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(processes, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(processes, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const rows = sortedData.map((row) => (
    <tr key={row.pid + row.name}>
      <td>{row.name}</td>
      <td>{row.pid}</td>
      <td>{row.cpuUsage}</td>
      <td>{row.memoryUsage}</td>
      <td>{row.status}</td>
    </tr>
  ));
  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === "pid"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("pid")}
            >
              PID
            </Th>
            <Th
              sorted={sortBy === "cpuUsage"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("cpuUsage")}
            >
              CPU Usage
            </Th>
            <Th
              sorted={sortBy === "memoryUsage"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("memoryUsage")}
            >
              Memory Usage
            </Th>
            <Th
              sorted={sortBy === "status"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("status")}
            >
              Status
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(processes[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

const ProcessesPage = () => {
  const { processes } = useMetricsContext();

  return (
    <PageWrapper name="Processes">
      <TableSort processes={processes} />
    </PageWrapper>
  );
};

export default ProcessesPage;
