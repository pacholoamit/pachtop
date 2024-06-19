import "@/features/metrics/styles/disk-treeview.css";

import { memo, useEffect, useState } from "react";
import { NodeRendererProps, Tree } from "react-arborist";

import DynamicProgress from "@/components/dynamic-progress";
import formatBytes from "@/features/metrics/utils/format-bytes";
import { DiskItem } from "@/lib";
import { Box, Group, Text, useMantineTheme } from "@mantine/core";
import { IconFile, IconFolderCancel, IconFolderOpen } from "@tabler/icons-react";

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

const Node = ({ node, style, dragHandle, tree, preview }: NodeRendererProps<DiskItem>) => {
  const { colors } = useMantineTheme();
  const [internalStyles, setInternalStyles] = useState(style);

  useEffect(() => {
    setInternalStyles((prev) => ({
      ...prev,
      backgroundColor: node.isSelected ? colors.gray[8] : "transparent",
    }));
  }, [node.isSelected]);

  return (
    <div style={internalStyles} className="node" ref={dragHandle} onClick={() => node.isInternal && node.toggle()}>
      <Group position="apart" noWrap>
        <div>
          {node.isLeaf ? <FileIcon fileName={node.data.name} /> : <FolderIcon isOpen={node.isOpen} />}
          {node.data.name}
        </div>

        <Group position="right">
          <Box w={60}>
            <DynamicProgress size={"xs"} value={node.data.size} />
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
