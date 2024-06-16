import { commands } from "@/lib";
import notification from "@/utils/notification";
import { Button, Code, Modal, Space, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ExclusionModal = () => {
  const [opened, { open, close }] = useDisclosure(true);

  const handleAddExclusion = async () => {
    await commands.add_pachtop_exclusion().catch((err) => {
      notification.error({
        title: "Failed to add Pachtop to exclusion list",
        message: "Please try again or add Pachtop to the exclusion list manually.",
      });
    });

    notification.success({
      title: "Pachtop added to exclusion list",
      message: "Pachtop has been added to the exclusion list in Microsoft Defender.",
    });

    close();
  };

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false} centered>
      <Stack>
        <Title order={3}>Thank you for using Pachtop!</Title>
        <Text size={"sm"}>This is a setup screen specifically for windows users, So you should feel special...</Text>
        <Text size={"sm"}>
          In order for Pachtop to be blazingly fast & performant, we need to add Pachtop to the exclusion list in
          Microsoft Defender.
        </Text>
        <Space />
        <Button variant="white" onClick={handleAddExclusion}>
          Make Pachtop blazingly fast 🚀
        </Button>
      </Stack>
    </Modal>
  );
};

export default ExclusionModal;
