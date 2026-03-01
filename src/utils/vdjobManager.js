let activeJobs = 0;
let queuedJobs = 0;
let activeFiles = new Set();
const MAX_QUEUE_SIZE = 10;

export const canAcceptJob = () => {
  return activeJobs + queuedJobs < MAX_QUEUE_SIZE;
};

export const incrementQueue = () => {
  queuedJobs++;
};

export const startJob = () => {
  queuedJobs--;
  activeJobs++;
};

export const finishJob = () => {
  activeJobs--;
};

export const getJobStats = () => ({
  activeJobs,
  queuedJobs,
  maxQueue: MAX_QUEUE_SIZE
});

export const registerActiveFile = (filePath) => {
  activeFiles.add(filePath);
};

export const unregisterActiveFile = (filePath) => {
  activeFiles.delete(filePath);
};

export const isFileActive = (filePath) => {
  return activeFiles.has(filePath);
};