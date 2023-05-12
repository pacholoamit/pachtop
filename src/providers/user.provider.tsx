import { createContext, useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Title, Text, Center, Stack, TextInput, Button, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateAppUserInput, createAppUser } from "@/api";
import store from "@/lib/store";
import useServerEventsContext from "@/hooks/useServerEventsContext";

interface UserProviderProps {
  children: React.ReactNode;
}

interface UserProviderContext {
  userId: string | null;
}

const UserContext = createContext<UserProviderContext>({
  userId: null,
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { sysInfo } = useServerEventsContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<CreateAppUserInput>({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      last_active: new Date(),
      operating_system: "",
      opt_in: true,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const checkifExistingUser = useCallback(async () => {
    const userId = await store.userId.get();
    if (!userId) {
      open();
      return;
    }
    setUserId(userId);
  }, []);

  useEffect(() => {
    checkifExistingUser();
  }, [checkifExistingUser]);

  const createAndSetUserId = async (values: CreateAppUserInput, opt_in = true) => {
    const result = await createAppUser({
      ...values,
      operating_system: sysInfo?.osVersion ?? "Not Available",
      last_active: new Date(),
      opt_in,
    });
    await store.userId.set(result.id);
    setUserId(result.id);
  };

  const handleSubmitForm = async (values: CreateAppUserInput) => {
    close();
    await createAndSetUserId(values);
  };

  const handleSkipForm = async (values: CreateAppUserInput) => {
    close();
    await createAndSetUserId(values, false);
  };

  return (
    <UserContext.Provider value={{ userId }}>
      <Modal opened={opened} onClose={() => {}} size="lg" withCloseButton={false}>
        <Center>
          <form onSubmit={form.onSubmit(handleSubmitForm)}>
            <Stack align="stretch" spacing={"lg"} m={"lg"}>
              <Title order={3}>Welcome 👋 </Title>
              <Text color="dimmed">
                We'd love to know who you are! We're using this information to learn more about early users, and we
                might send you an email to let you know when the full version of the app is released. Pachtop will
                always be an Open Source and free project.
              </Text>
              <Space />

              <TextInput placeholder="First Name" {...form.getInputProps("first_name")} />
              <TextInput placeholder="Last Name" {...form.getInputProps("last_name")} />
              <TextInput placeholder="Email Address" {...form.getInputProps("email")} />
              <Space />
              <Button type="submit">Submit</Button>
              <Button
                onClick={() => form.onSubmit(handleSkipForm)}
                sx={(theme) => {
                  return {
                    backgroundColor: theme.colors.dark[6],
                    ":hover": {
                      backgroundColor: theme.colors.dark[6],
                    },
                  };
                }}
              >
                Skip
              </Button>
            </Stack>
          </form>
        </Center>
      </Modal>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
