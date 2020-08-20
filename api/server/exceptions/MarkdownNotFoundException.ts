import HttpException from './HttpException';

class MarkdownNotFoundException extends HttpException {
  constructor(filename: string) {
    super(404, `Markdown ${filename} not found`);
  }
}

export default MarkdownNotFoundException;
