import { createContext, useEffect, useState } from "react";
import { Config, User } from "@/lib/types";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Title, Text, Center, Stack, TextInput, Button, Space } from "@mantine/core";
import { Command, invoke } from "@/lib";
import { useForm } from "@mantine/form";
import { CreateAppUserInput, createAppUser } from "@/api";
import notification from "@/utils/notification";

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

  const form = useForm<CreateAppUserInput>({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      skipped_setup: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmitForm = async (values: CreateAppUserInput) => {
    const result = await createAppUser(values).catch((e) => {
      console.log(e);
    });
    close();
    console.log(result);
  };

  const handleSkipForm = async (values: CreateAppUserInput) => {
    const result = await createAppUser({ ...values, skipped_setup: true }).catch((e) => {
      console.log(e);
    });
    close();
    console.log(result);
  };

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
    <UserContext.Provider value={{ user }}>
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
