const Gallery = require('../models/Gallery');
const { logEvent } = require('../utils/logger');

// @desc    Get all gallery media
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Failed to fetch gallery media' });
  }
};

// @desc    Add a gallery item (photo/video via upload or link)
// @route   POST /api/admin/gallery
// @access  Private (Admin)
const createGalleryItem = async (req, res) => {
  const { type, title, source, url } = req.body;

  if (!type || !title || !source || !url) {
    return res.status(400).json({ message: 'All fields (type, title, source, url) are required' });
  }

  try {
    const item = await Gallery.create({
      type,
      title,
      source,
      url
    });

    logEvent('GALLERY_ITEM_CREATED', req.user._id, req.user.role, `Added ${type} gallery item: ${title}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(500).json({ message: 'Failed to add gallery item' });
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/admin/gallery/:id
// @access  Private (Admin)
const deleteGalleryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await Gallery.deleteOne({ _id: id });
    logEvent('GALLERY_ITEM_DELETED', req.user._id, req.user.role, `Deleted ${item.type} gallery item: ${item.title}`);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Failed to delete gallery item' });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
};
