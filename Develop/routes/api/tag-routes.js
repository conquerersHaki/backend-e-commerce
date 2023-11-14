const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll().then((tagData) => {
    res.json(tagData);
  });
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', (req, res) => {
  Tag.findOne(
    {
      where: {
        tag_id: req.params.tag_id,
      },
    },
  ).then((tagData) => {
    res.json(tagData);
  });
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  Tag.create(req.body).then((newTag) => {
    res.json(newTag);
  }).catch((err) => {
    res.json(err);
  });
  // create a new tag
});

router.put('/:id', (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        tag_id: req.params.tag_id,
      },
    }
  ).then((updatedTag) => {
    res.json(updatedTag);
  }).catch((err) => res.json(err));
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      tag_id: req.params.tag_id,
    },
  }).then((deletedTag) => {
    res.json(deletedTag);
  }).catch((err) => res.json(err));
  // delete on tag by its `id` value
});

module.exports = router;
