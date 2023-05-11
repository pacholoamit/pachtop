import { createContext, useEffect, useState } from "react";
import { User } from "@/api";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Title, Text, Center, Stack, TextInput, Button, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateAppUserInput, createAppUser } from "@/api";
import store from "@/lib/store";

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
  const [opened, { open, close }] = useDisclosure(true);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<CreateAppUserInput>({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      last_active: new Date(),
      operating_system: "Example OS",
      opt_in: true,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    store.userId.get().then((id) => {
      console.log(id);
      if (!id) return open();
      setUserId(id);
    });
  }, []);

  const handleSubmitForm = async (values: CreateAppUserInput) => {
    const result = await createAppUser(values);
    close();
    setUserId(result.id);
  };

  const handleSkipForm = async (values: CreateAppUserInput) => {
    const result = await createAppUser({ ...values, opt_in: false });
    close();
    setUserId(result.id);
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
