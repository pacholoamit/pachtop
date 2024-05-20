import useKillProcess from '@/features/processes/hooks/useKillProcess';
import { Process } from '@/lib';
import { Button, Group, Modal, Space, Text } from '@mantine/core';

interface KillProcessVerificationProps {
  selectedProcess: Process | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
  setRecords: React.Dispatch<React.SetStateAction<Process[]>>;
}
const KillProcessVerification: React.FC<KillProcessVerificationProps> = ({
  setSelectedProcess,
  selectedProcess,
  setRecords,
}) => {
  const [kill] = useKillProcess({
    onKill() {
      setRecords((records) => records.filter((r) => r.pid !== selectedProcess?.pid));
    },
  });

  const onCancel = () => {
    setSelectedProcess(null);
  };
  const onKill = () => {
    kill(selectedProcess as Process);
    setSelectedProcess(null);
  };

  return (
    <Modal title="Are you sure?" onClose={onCancel} opened={!!selectedProcess} centered>
      <Space h="md" />
      <Text> Are you sure you want to kill {selectedProcess?.name}? </Text>
      <Space h="xl" />
      <Group position="right">
        <Button onClick={onCancel}>Cancel</Button>
        <Button color={"red"} onClick={onKill}>
          Kill
        </Button>
      </Group>
    </Modal>
  );
};

export default KillProcessVerification;
