import "@/features/metrics/styles/disk-treeview.css";

import TreeView, { INode } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList } from "react-icons/fa";

import { Group, ScrollArea } from "@mantine/core";
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

interface DiskDirectoryTreeViewProps {
  data: INode<IFlatMetadata>[];
}
const DiskDirectoryTreeView: React.FC<DiskDirectoryTreeViewProps> = (props) => {
  const { data } = props;

  return (
    <ScrollArea h="90%">
      <TreeView
        aria-label="directory Tree"
        togglableSelect
        clickAction="EXCLUSIVE_SELECT"
        multiSelect
        data={data}
        nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level, handleExpand }) => {
          if (element?.metadata) {
            console.log(element.metadata);
          }

          return (
            <Group position="apart">
              <div {...getNodeProps({ onClick: handleExpand })} style={{ paddingLeft: 20 * (level - 1) }}>
                {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon fileName={element.name} />}
                {element.name}
              </div>
            </Group>
          );
        }}
      />
    </ScrollArea>
  );
};

export default DiskDirectoryTreeView;
