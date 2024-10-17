
export default class DivBlock {
  data: HTMLElement[] | string | null;
  div: HTMLElement = document.createElement('div');

  constructor (data: HTMLElement[] | string, className: string) {
    this.data = data;
    this.div.setAttribute('class', className);
  }

  render() {
    if (typeof this.data === 'string') {
      this.div.textContent = this.data;
    } else {
      this.data.forEach(item => {
        this.div.appendChild(item);
      });
    }

    return this.div;
  }
}