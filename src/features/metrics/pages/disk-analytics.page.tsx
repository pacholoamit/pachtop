import './styles.css';

import React, { useEffect } from 'react';
import TreeView, { flattenTree, INode } from 'react-accessible-treeview';
import { IFlatMetadata } from 'react-accessible-treeview/dist/TreeView/utils';
import { DiCss3, DiJavascript, DiNpm } from 'react-icons/di';
import { FaList, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import Card from '@/components/card';
import PageWrapper from '@/components/page-wrapper';
import DiskInformationAnalyticsCard from '@/features/metrics/components/disks/disk.information-analytics';
import DiskNotFound from '@/features/metrics/components/disks/disk.notfound';
import useServerEventsContext from '@/hooks/useServerEventsContext';
import { commands, Disk, DiskItem } from '@/lib';
import { Button, Center, Grid, Group, Loader, Stack, Title } from '@mantine/core';
import { IconFile, IconFolderCancel, IconFolderOpen } from '@tabler/icons-react';

interface DiskAnalyticsPageProps {}

const defaultDisk: Disk = {
  diskType: "unknown",
  fileSystem: "unknown",
  free: 0,
  isRemovable: false,
  mountPoint: "unknown",
  total: 0,
  name: "unknown",
  timestamp: BigInt(0),
  used: 0,
  usedPercentage: 0,
};

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? <IconFolderOpen className="icon" /> : <IconFolderCancel className="icon" />;
};

const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop();

  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    default:
      return <IconFile />;
  }
};

const DiskAnalyticsPage: React.FC<DiskAnalyticsPageProps> = () => {
  const { disks } = useServerEventsContext();
  const { id = "" } = useParams();
  const [disk, setDisk] = React.useState<Disk>(defaultDisk);
  const [diskAnalysis, setDiskAnalysis] = React.useState<INode<IFlatMetadata>[]>([]);

  const startDiskAnalysis = async () => {
    await commands.deepScan({ path: disk.mountPoint }).then((item) => {
      setDiskAnalysis(flattenTree(item as any));
      console.log(diskAnalysis);
    });
  };

  useEffect(() => {
    if (!disks) return;
    const disk = disks.find((d) => d.id === id);

    if (disk?.data?.length ?? 0 > 0) {
      setDisk(disk?.data?.at(-1) || defaultDisk);
    }
  }, [disks]);

  return (
    <PageWrapper name={id}>
      <Grid>
        <Grid.Col span={3}>
          <DiskInformationAnalyticsCard disk={disk} startDiskAnalysis={startDiskAnalysis} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Card height="350px">
            <Group position="apart">
              <Title order={4}>Disk Analysis</Title>
            </Group>
            <TreeView
              data={diskAnalysis}
              nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
                <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
                  {isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon fileName={element.name} />}

                  {element.name}
                </div>
              )}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default DiskAnalyticsPage;
