import path from 'path';
import fs from 'fs';

const readData = (filePathRelativeToCwd) => {
  const filePath = path.join(process.cwd(), filePathRelativeToCwd);
  const file = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
};

export default readData;
