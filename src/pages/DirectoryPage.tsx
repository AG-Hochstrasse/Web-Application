import { Heading, PageLayout } from "@primer/react";
import DirectoryList from "../components/files/DirectoryList";

interface DirectoryListProps {
  bucketName: string;
  path?: string;
}

export default function DirectoryPage({ bucketName, path }: DirectoryListProps) {
  const dirPath = path ?? ""
  return <PageLayout>
    <PageLayout.Header>
      <Heading>Files: {bucketName}{dirPath}</Heading>
    </PageLayout.Header>

    <PageLayout.Content>
      <DirectoryList bucketName={bucketName} path={path} />
    </PageLayout.Content>
  </PageLayout>
}