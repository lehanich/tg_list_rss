import { Result } from './Result';

export interface FileData {
  file_id: string,
  file_unique_id: string,
  file_size: number,
  file_path: string
}

export interface File extends Result {
  result: FileData
}