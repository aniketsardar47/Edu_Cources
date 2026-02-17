const API_BASE_URL = "http://localhost:7777/api";

export const api = {
  // Get all courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  // Get single course
  getCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  // Get all videos for a course
  getCourseVideos: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/videos/course/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return response.json();
  },

  // Get single video
  getVideo: async (courseId, videoId) => {
    const response = await fetch(`${API_BASE_URL}/videos/course/${courseId}/${videoId}`);
    if (!response.ok) throw new Error('Failed to fetch video');
    return response.json();
  }
};