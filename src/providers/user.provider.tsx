import { createContext, useEffect, useState } from "react";
import { Config, User } from "@/lib/types";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Title, Text, Center, Stack } from "@mantine/core";
import { Command, invoke } from "@/lib";
import { useForm } from "@mantine/form";

interface UserProviderProps {
  children: React.ReactNode;
}

interface UserProviderContext {
  user: User | null;
}

const UserContext = createContext<UserProviderContext>({
  user: null,
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm({
    initialValues: {
      
    }
  })

  useEffect(() => {
    invoke<{}, Config>(Command.ReadConfig).then((c) => {
      if (!c?.user?.user_hash) {
        open();
        return;
      }
      setUser(c.user);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      <Modal opened={opened} onClose={() => {}} size="lg" withCloseButton={false}>
        <Center>
          <Stack align="center">
            <Title order={3}>Welcome 👋 </Title>
            <Text color="dimmed">
              We'd love to know who you are! We're using this information to learn more about early users, and we might
              send you an email to let you know when the full version of the app is released
            </Text>
          </Stack>
        </Center>
      </Modal>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
