import "@/features/metrics/styles/disk-treeview.css";

import { memo, useCallback, useEffect, useState } from "react";
import { NodeRendererProps, Tree } from "react-arborist";

import DynamicProgress from "@/components/dynamic-progress";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { commands, DiskItem } from "@/lib";
import logger from "@/lib/logger";
import notification from "@/utils/notification";
import { Box, Group, Text, useMantineTheme } from "@mantine/core";
import { IconFile, IconFolderCancel, IconFolderOpen } from "@tabler/icons-react";
import { Menu, MenuItem } from "@tauri-apps/api/menu";

const iconStyle = { paddingRight: "5px", verticalAlign: "middle" };

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? <IconFolderOpen style={iconStyle} /> : <IconFolderCancel style={iconStyle} />;
};

const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop();

  switch (extension) {
    default:
      return <IconFile style={iconStyle} />;
  }
};

interface NodeContextMenuProps extends Omit<DiskItem, "children"> {}

const Node = ({ node, style, dragHandle, tree, preview }: NodeRendererProps<DiskItem>) => {
  const { colors } = useMantineTheme();
  const [internalStyles, setInternalStyles] = useState(style);

  const contextMenuOpenAction = useCallback(async (diskItem: NodeContextMenuProps) => {
    logger.trace("Open action trigger for node: ", diskItem.name);

    commands.open(diskItem.path).catch((err) => {
      notification.error({
        title: `Error opening file ${diskItem.name}`,
        message: "An error occurred while trying to open the file.",
      });
      logger.error("Error opening file: ", err);
    });
  }, []);

  const contextMenuOpenInExplorerAction = useCallback(async (diskItem: NodeContextMenuProps) => {
    logger.trace("Open in Explorer action trigger for node: ", diskItem.name);

    commands.open(diskItem.path).catch((err) => {
      notification.error({
        title: "Error opening in explorer",
        message: "An error occurred while trying to open the folder in explorer.",
      });
      logger.error("Error opening in explorer: ", err);
    });
  }, []);

  const contextMenuShowInTerminalAction = useCallback(async (diskItem: NodeContextMenuProps) => {
    logger.trace("Copy Path action trigger for node: ", diskItem.name);
    commands.showInTerminal(diskItem.path).catch((err) => {
      notification.error({
        title: "Error opening in terminal",
        message: "An error occurred while trying to open the folder in terminal.",
      });
      logger.error("Error opening in terminal: ", err);
    });
  }, []);

  const contextMenuShowDeleteAction = useCallback(async (diskItem: NodeContextMenuProps) => {
    logger.trace("Delete action trigger for node: ", diskItem.name);

    if (node.isLeaf) {
      return commands.deleteFile(diskItem.path).catch((err) => {
        notification.error({
          title: `Error deleting file ${diskItem.name}`,
          message: "An error occurred while trying to delete the file.",
        });
        logger.error("Error deleting file: ", err);
      });
    }

    commands.deleteFolder(diskItem.path).catch((err) => {
      notification.error({
        title: `Error deleting folder ${diskItem.name}`,
        message: "An error occurred while trying to delete the folder.",
      });
      logger.error("Error deleting folder: ", err);
    });
  }, []);

  const showContextMenu = useCallback(async (e: React.MouseEvent, diskItem: NodeContextMenuProps) => {
    logger.trace("Showing context menu for disk item - ", diskItem.name);

    const menuItems = await Promise.all([
      MenuItem.new({
        text: "Open",
        enabled: node.isLeaf,
        action: () => contextMenuOpenAction(diskItem),
      }),
      MenuItem.new({
        text: "Open in Explorer",
        enabled: !node.isLeaf, // Disable for files
        action: () => contextMenuOpenInExplorerAction(diskItem),
      }),

      MenuItem.new({
        text: "Open in Terminal",
        enabled: !node.isLeaf, // Disable for files
        action: () => contextMenuShowInTerminalAction(diskItem),
      }),
      MenuItem.new({
        text: "Rename",
        action: () => {
          logger.trace("Rename action trigger for node: ", diskItem.name);
        },
      }),
      MenuItem.new({
        text: "Copy",
        action: () => {
          logger.trace("Copy action trigger for node: ", diskItem.name);
        },
      }),

      MenuItem.new({
        text: "Delete",
        action: () => contextMenuShowDeleteAction(diskItem),
      }),
    ]);

    const menu = await Menu.new({ items: menuItems });

    await menu.popup().catch((err) => logger.error("Error showing context menu: ", err));
  }, []);

  useEffect(() => {
    setInternalStyles((prev) => ({
      ...prev,
      backgroundColor: node.isSelected ? colors.gray[8] : "transparent",
    }));
  }, [node.isSelected]);

  return (
    <div
      style={internalStyles}
      className="node"
      ref={dragHandle}
      onClick={() => node.isInternal && node.toggle()}
      onContextMenu={(e) => {
        const { children, ...prop } = node.data;
        node.select();
        showContextMenu(e, prop);
      }}
    >
      <Group position="apart" noWrap>
        <div>
          {node.isLeaf ? <FileIcon fileName={node.data.name} /> : <FolderIcon isOpen={node.isOpen} />}
          {node.data.name}
        </div>

        <Group position="right">
          <Box w={60}>
            <DynamicProgress size={"xs"} value={node.data.percentageOfDisk} />
          </Box>
          <Box w={60}>
            <Group position="right">
              <Text size="xs" color="dimmed">
                {formatBytes(node.data.size as number)}
              </Text>
            </Group>
          </Box>
        </Group>
      </Group>
    </div>
  );
};

interface DiskDirectoryTreeViewProps {
  data: any;
}
const DiskDirectoryTreeView: React.FC<DiskDirectoryTreeViewProps> = (props) => {
  const { data } = props;

  return (
    <Tree
      data={data}
      openByDefault={false}
      width={"100%"}
      height={350}
      indent={24}
      rowHeight={36}
      overscanCount={1}
      paddingTop={30}
      paddingBottom={10}
      padding={25}
    >
      {Node}
    </Tree>
  );
};

export default memo(DiskDirectoryTreeView);
