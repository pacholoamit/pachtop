import { showNotification } from "@mantine/notifications";

interface NotificationOpts {
    title: string;
    message: string;
}

const notification = {
    success: (opts: NotificationOpts) => {
        showNotification({
            title: opts.title,
            message: opts.message,
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.green[6],
                    borderColor: theme.colors.green[6],
                    "&::before": { backgroundColor: theme.white },
                },

                title: { color: theme.white },
                description: { color: theme.white },
                closeButton: {
                    color: theme.white,
                    "&:hover": { backgroundColor: theme.colors.green[7] },
                },
            }),
        });
    },
    error: (opts: NotificationOpts) => {
        showNotification({
            title: opts.title,
            message: opts.message,
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.red[6],
                    borderColor: theme.colors.red[6],
                    "&::before": { backgroundColor: theme.white },
                },

                title: { color: theme.white },
                description: { color: theme.white },
                closeButton: {
                    color: theme.white,
                    "&:hover": { backgroundColor: theme.colors.red[7] },
                },
            }),
        });
    }
}

export default notification;