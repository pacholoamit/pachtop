import useServerEventsContext from "@/hooks/useServerEventsContext";
import DiskInfo from "@/features/metrics/components/disks/disk.info";
import PageWrapper from "@/components/page-wrapper";
import { Button, Grid } from "@mantine/core";
import React from "react";
import { commands } from "../../../lib";

const DisksPage = () => {
  const { disks } = useServerEventsContext();

  const onCheckDisk = async (mountPoint: string) => {
    console.log("Checking disk", mountPoint);
    await commands.deepScan({ path: mountPoint }).then((res) => {
      console.log(res);
    });
  };

  console.log(disks);
  return (
    <PageWrapper name="Disks">
      <Grid>
        {disks?.map((disk, i) => (
          <React.Fragment key={disk.id + i}>
            <Grid.Col span={12}>
              <DiskInfo key={disk.id} disk={disk} />
              <Button
                onClick={async () => {
                  await onCheckDisk(disk.data.at(-1)?.mountPoint || "");
                }}
              >
                Check Disk
              </Button>
            </Grid.Col>
          </React.Fragment>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default DisksPage;
