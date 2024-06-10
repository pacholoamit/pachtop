import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";

interface NotificationOpts {
  title: string;
  message: string;
}

const notification = {
  warn: (opts: NotificationOpts) => {
    notifications.show({
      title: opts.title,
      message: opts.message,
      icon: <IconAlertCircle />,
    });
  },
  success: (opts: NotificationOpts) => {
    notifications.show({
      title: opts.title,
      message: opts.message,
      icon: <IconCheck />,
    });
  },
  error: (opts: NotificationOpts) => {
    notifications.show({
      title: opts.title,
      message: opts.message,
      icon: <IconX />,
    });
  },
};

export default notification;
