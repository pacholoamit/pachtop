import "@/features/metrics/styles/disk-treeview.css";

import TreeView, { INode } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList } from "react-icons/fa";

import { ScrollArea } from "@mantine/core";
import { IconFile, IconFolderCancel, IconFolderOpen } from "@tabler/icons-react";

const iconStyle = { paddingRight: "5px", verticalAlign: "middle" };

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? <IconFolderOpen style={iconStyle} /> : <IconFolderCancel style={iconStyle} />;
};

const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop();

  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" style={iconStyle} />;
    case "css":
      return <DiCss3 color="turquoise" style={iconStyle} />;
    case "json":
      return <FaList color="yellow" style={iconStyle} />;
    case "npmignore":
      return <DiNpm color="red" style={iconStyle} />;
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
        nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level, handleExpand }) => (
          <div {...getNodeProps({ onClick: handleExpand })} style={{ paddingLeft: 20 * (level - 1) }}>
            {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon fileName={element.name} />}
            {element.name}
          </div>
        )}
      />
    </ScrollArea>
  );
};

export default DiskDirectoryTreeView;
