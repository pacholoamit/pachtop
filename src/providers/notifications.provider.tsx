interface NotificationsProviderProps {
  children: React.ReactNode;
}
const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  return <NotificationsProvider>{children}</NotificationsProvider>;
};

export default NotificationsProvider;
