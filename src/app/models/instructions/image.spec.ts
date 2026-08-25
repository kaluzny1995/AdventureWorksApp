import { Image } from './image';

describe('Image', () => {
  it('should create an instance', () => {
    expect(new Image('title', 'src', null, false)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const img = new Image('My Image', '/path/img.png', 'Label', true);
    expect(img.title).toBe('My Image');
    expect(img.src).toBe('/path/img.png');
    expect(img.label).toBe('Label');
    expect(img.isHalf).toBeTrue();
  });

  describe('fromJson', () => {
    it('should create instance from JSON and replace template', () => {
      const json = {title: 'Image 1', src: 'img.png', label: 'Label', isHalf: false};
      const img = Image.fromJson(json, '/assets/${}');
      expect(img.title).toBe('Image 1');
      expect(img.src).toBe('/assets/img.png');
      expect(img.label).toBe('Label');
      expect(img.isHalf).toBeFalse();
    });

    it('should handle null label', () => {
      const json = {title: 'Image', src: 'img.png', label: null, isHalf: true};
      const img = Image.fromJson(json, '/path/${}');
      expect(img.label).toBeNull();
    });
  });

  describe('fromJsonList', () => {
    it('should create list from JSON list', () => {
      const jsonList = [
        {title: 'Img1', src: 'a.png', label: null, isHalf: false},
        {title: 'Img2', src: 'b.png', label: 'L', isHalf: true}
      ];
      const result = Image.fromJsonList(jsonList, '/path/${}');
      expect(result.length).toBe(2);
      expect(result[0].src).toBe('/path/a.png');
      expect(result[1].src).toBe('/path/b.png');
    });

    it('should return empty array for empty list', () => {
      expect(Image.fromJsonList([], '/path/${}')).toEqual([]);
    });
  });
});
