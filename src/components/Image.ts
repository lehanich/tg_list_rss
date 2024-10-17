import { File, FileData} from '@models/File';
import { Photo } from '@models/Post';
import {PUBLIC_URL_FILES} from '@api/variables';
import { BotAPI} from '@api/api';

export default class Image {
  data: Photo[] | null;
  file: FileData;
  img: HTMLImageElement = document.createElement('img');

  constructor (photo: Photo[] | undefined) {
    this.data = photo;

    !this.data
      ? (
        this.img.setAttribute('width', '0'),
        this.img.setAttribute('height','0'),
        this.img.setAttribute('class','image hidden')
      )
      : (
        this.getFile(photo[photo.length-1].file_id),
        this.img.setAttribute('class', 'image')
      );
  }

  getFile (fileId: string) {
    BotAPI()
      .getFile(fileId)
      .then((data: File) => {
        this.img.src = `${PUBLIC_URL_FILES}` + data.result.file_path;
        this.file = data.result;
      });
  }

  render() {
    // this.img.src = `${PUBLIC_URL_FILES}` + this.file.file_path;

    return this.img;
  }
}