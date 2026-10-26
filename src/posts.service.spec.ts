import { Post, PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(() => {
    postsService = new PostsService();
  });

  describe('.findMany', () => {
    // Создаём четыре поста перед каждым тестом
    const posts = [
      { text: 'Post 1' },
      { text: 'Post 2' },
      { text: 'Post 3' },
      { text: 'Post 4' },
    ];

    beforeEach(() => {
      posts.forEach((post) => postsService.create(post));
    });

    // 1. Базовый случай: без опций
    it('should return all posts if called without options', () => {
      const foundedPosts = postsService.findMany();

      expect(foundedPosts).toEqual([
        { id: '1', text: 'Post 1' },
        { id: '2', text: 'Post 2' },
        { id: '3', text: 'Post 3' },
        { id: '4', text: 'Post 4' },
      ]);
    });

    // 2. Совместное использование skip и limit
    it('should return correct posts for skip and limit options', () => {
      const skip = 1;
      const limit = 2;

      const foundedPosts = postsService.findMany({ skip, limit });

      expect(foundedPosts).toEqual([
        { id: '2', text: 'Post 2' },
        { id: '3', text: 'Post 3' },
      ]);
    });

    // 3. Только skip
    it('should skip specified number of posts when only skip is provided', () => {
      const foundedPosts = postsService.findMany({ skip: 2 });

      expect(foundedPosts).toEqual([
        { id: '3', text: 'Post 3' },
        { id: '4', text: 'Post 4' },
      ]);
    });

    // 4. Только limit
    it('should limit the number of posts when only limit is provided', () => {
      const foundedPosts = postsService.findMany({ limit: 2 });

      expect(foundedPosts).toEqual([
        { id: '1', text: 'Post 1' },
        { id: '2', text: 'Post 2' },
      ]);
    });

    // 5. skip больше длины массива
    it('should return an empty array if skip exceeds the number of posts', () => {
      const foundedPosts = postsService.findMany({ skip: 10 });

      expect(foundedPosts).toEqual([]);
    });

    // 6. limit больше длины массива
    it('should return all posts if limit exceeds the number of posts', () => {
      const foundedPosts = postsService.findMany({ limit: 10 });

      expect(foundedPosts).toHaveLength(4); // длина исходного массива
      expect(foundedPosts).toEqual([
        { id: '1', text: 'Post 1' },
        { id: '2', text: 'Post 2' },
        { id: '3', text: 'Post 3' },
        { id: '4', text: 'Post 4' },
      ]);
    });

    // 7. limit = 0
    it('should return an empty array if limit is zero', () => {
      const foundedPosts = postsService.findMany({ limit: 0 });

      expect(foundedPosts).toEqual([]);
    });

    // 8. skip = 0
    it('should return all posts if skip is zero', () => {
      const foundedPosts = postsService.findMany({ skip: 0 });

      expect(foundedPosts).toEqual([
        { id: '1', text: 'Post 1' },
        { id: '2', text: 'Post 2' },
        { id: '3', text: 'Post 3' },
        { id: '4', text: 'Post 4' },
      ]);
    });

    // 9. skip и limit равны 0
    it('should return an empty array if both skip and limit are zero', () => {
      const foundedPosts = postsService.findMany({ skip: 0, limit: 0 });

      expect(foundedPosts).toEqual([]);
    });

    // 10. Отрицательные значения (дополнительная защита)
    it('should handle negative skip and limit gracefully', () => {
      // Поведение slice с отрицательными значениями не документировано,
      // но метод не должен выбрасывать ошибку.
      expect(() => postsService.findMany({ skip: -1 })).not.toThrow();
      expect(() => postsService.findMany({ limit: -1 })).not.toThrow();
    });
  });
});