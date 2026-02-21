import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/AdminApi";

const UploadVideoModal = ({ isOpen, onClose, onSuccess, courses }) => {
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    order: "1",
    video: null,
    textContent: "",
    notesFiles: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "video") {
      setForm({ ...form, video: files[0] });
    } else if (name === "files") {
      setForm({ ...form, notesFiles: Array.from(files) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.courseId || !form.title || !form.video) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("courseId", form.courseId);
      formData.append("title", form.title);
      formData.append("textContent", form.textContent || form.description);
      formData.append("order", form.order);

      // Append each PDF file
      form.notesFiles.forEach(file => {
        formData.append("files", file);
      });

      formData.append("video", form.video);

      const response = await api.post("/admin/upload-video", formData);

      alert("Video uploaded successfully!");
      setForm({
        courseId: "",
        title: "",
        description: "",
        order: "1",
        video: null,
        textContent: "",
        notesFiles: []
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 my-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload Video</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course *
            </label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              required
            >
              <option value="">Choose a course...</option>
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 1: Introduction"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Video description..."
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order (Position)
              </label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video File *
              </label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                accept="video/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                required
              />
            </div>
          </div>

          {form.video && (
            <p className="text-sm text-green-600">✓ {form.video.name}</p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PDF Notes (Multiple)
            </label>
            <input
              type="file"
              name="files"
              onChange={handleFileChange}
              multiple
              accept=".pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
            {form.notesFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {form.notesFiles.map((file, idx) => (
                  <p key={idx} className="text-xs text-gray-500 truncate">
                    📄 {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoModal;
