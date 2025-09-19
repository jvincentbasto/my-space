const envs = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  bucket: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
  project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
};

//
const constructUrl = (bucketField: string, type: number = 1) => {
  let url = `${envs.endpoint}/storage/buckets`;
  url = `${url}/${envs.bucket}/files/${bucketField}`;

  if (type === 1) {
    url = `${url}/view?project=${envs.project}`;
  } else if (type === 2) {
    url = `${url}/download?project=${envs.project}`;
  }

  return url;
};
const constructFileUrl = (bucketField: string) => {
  const url = constructUrl(bucketField, 1);
  return url;
};
const constructDownloadUrl = (bucketField: string) => {
  const url = constructUrl(bucketField, 2);
  return url;
};

export const appwriteUtils = {
  constructFileUrl,
  constructDownloadUrl,
};
