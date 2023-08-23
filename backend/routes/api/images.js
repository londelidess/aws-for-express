const express = require("express");
const { Image } = require("../../db/models");
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile, deleteFile } = require("../../awsS3");

const router = express.Router();

router.post(
  '/:userId',
  multipleMulterUpload("images"),
  async (req, res) => {
    const { userId } = req.params;
    const keys = await multipleFilesUpload({ files: req.files });
    const images = await Promise.all(
      keys.map(key => Image.create({ key, userId }))
    );
    const imageUrls = images.map(image => retrievePrivateFile(image.key));
    return res.json(imageUrls);
  }
);

router.get(
  '/:userId',
  async (req, res) => {
    const images = await Image.findAll({where: { userId: req.params["userId"] }});
    const imageObjects = images.map(image => {
      return {
        id: image.id,
        url: retrievePrivateFile(image.key)
      };
    });

    return res.json(imageObjects);
  }
);

router.delete(
  '/:imageId',
  async (req, res) => {
  const image = await Image.findByPk(req.params.imageId);
  if (image) {
      await deleteFile(image.key);
      await image.destroy();
      return res.json({ imageId: req.params.imageId });
  } else {
      return res.status(404).json({ message: 'Image not found' });
  }
});

module.exports = router;
