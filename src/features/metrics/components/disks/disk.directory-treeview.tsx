import "@/features/metrics/styles/disk-treeview.css";

import { memo } from "react";
import { NodeRendererProps, Tree } from "react-arborist";

import formatBytes from "@/features/metrics/utils/format-bytes";
import { DiskItem } from "@/lib";
import { Group, Text } from "@mantine/core";
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
  return (
    <div style={style} className="node" ref={dragHandle} onClick={() => node.isInternal && node.toggle()}>
      <Group position="apart" noWrap>
        <div>
          {node.isLeaf ? <FileIcon fileName={node.data.name} /> : <FolderIcon isOpen={node.isOpen} />}
          {node.data.name}
        </div>

        <Text size="xs" color="dimmed">
          {formatBytes(node.data.size as number)}
        </Text>
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
