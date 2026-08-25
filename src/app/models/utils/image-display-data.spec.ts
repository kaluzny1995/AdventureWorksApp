import { ImageDisplayData } from './image-display-data';

describe('ImageDisplayData', () => {
  it('should create an instance', () => {
    expect(new ImageDisplayData('title', 'src')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const data = new ImageDisplayData('My Image', '/path/to/image.png');
    expect(data.title).toBe('My Image');
    expect(data.src).toBe('/path/to/image.png');
  });
});
