import { NotificationsProvider as MantineNotificationsProvider } from "@mantine/notifications";

interface NotificationsProviderProps {
  children: React.ReactNode;
}
const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  return (
    <MantineNotificationsProvider>{children}</MantineNotificationsProvider>
  );
};

export default NotificationsProvider;
