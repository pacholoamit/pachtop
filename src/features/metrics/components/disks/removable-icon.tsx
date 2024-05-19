import { ActionIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

interface RemovableIconProps {
  isRemovable?: boolean;
}

// TOOD: Use on disk details page
const RemovableIcon: React.FC<RemovableIconProps> = (props) => {
  return props.isRemovable ? (
    <ActionIcon variant="transparent" color="green">
      <IconCheck size={"1rem"} />
    </ActionIcon>
  ) : (
    <ActionIcon variant="transparent" color="red">
      <IconX size={"1rem"} />
    </ActionIcon>
  );
};

export default RemovableIcon;