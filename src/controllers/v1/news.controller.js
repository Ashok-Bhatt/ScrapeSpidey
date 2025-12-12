import News from "../../models/news.model.js";
import { destroyFile, uploadFile } from "../../utils/cloudinary.js";
import handleError from "../../utils/errorHandler.js";

const createNews = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No image file provided" });
    if (!title || !title.trim()) return res.status(400).json({ message: "news title is required!" });
    if (!description || !description.trim()) return res.status(400).json({ message: "news description is required!" });

    const newsImageUrl = await uploadFile(file.path, "ScrapeSpidey");
    if (!newsImageUrl) return res.status(400).json({ message: "News image not uploaded!" });

    const newNews = await News.create({
      title: title,
      description: description,
      date: date || new Date(),
      image: newsImageUrl,
    })

    if (!newNews) return res.status(500).json({ message: "News not created!" });
    return res.status(201).json({ message: "News created successfully!" });
  } catch (error) {
    return handleError(res, error, "Error while creating news:");
  }
}

const getAllNews = async (req, res) => {
  try {
    const allNews = await News.find().sort({ date: -1 });
    return res.status(200).json({ news: allNews });
  } catch (error) {
    return handleError(res, error, "Error while fetching news:");
  }
};

const updateNews = async (req, res) => {
  try {
    const { id, title, description, date } = req.body;
    const file = req.file;

    if (!id) return res.status(400).json({ message: "News ID is required!" });

    const existingNews = await News.findById(id);
    if (!existingNews) return res.status(404).json({ message: "News not found!" });

    existingNews.title = title || existingNews.title;
    existingNews.description = description || existingNews.description;
    existingNews.date = date || existingNews.date;

    if (file) {
      const previousImageUrl = existingNews.image;
      const newImageUrl = await uploadFile(file.path, "ScrapeSpidey");

      if (newImageUrl) {
        existingNews.image = newImageUrl;
        await destroyFile(previousImageUrl);
      }
    }

    await existingNews.save();

    return res.status(200).json({ message: "News updated successfully!" });
  } catch (error) {
    return handleError(res, error, "Error while updating news:");
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "News ID is required!" });

    const deletedNews = await News.findByIdAndDelete(id);

    if (deletedNews) {
      const deletedNewsImageUrl = deletedNews.image;
      await destroyFile(deletedNewsImageUrl);
    } else {
      return res.status(404).json({ message: "News not found!" });
    }

    return res.status(200).json({ message: "News deleted successfully!" });
  } catch (error) {
    return handleError(res, error, "Error while deleting news:");
  }
};

export {
  createNews,
  getAllNews,
  updateNews,
  deleteNews,
}