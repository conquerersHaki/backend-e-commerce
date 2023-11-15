const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint
// get all products
router.get("/", (req, res) => {
  Product.findAll().then((productData) => {
    res.json(productData);
  });
});

// get one product
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
  }).then((productData) => {
    res.json(productData);
  });
});

// create new product
// create new product
router.post("/", async (req, res) => {
  try {
    const productData = await Product.create(req.body);

    // Check if tagIds exists and is an array
    if (
      req.body.tagIds &&
      Array.isArray(req.body.tagIds) &&
      req.body.tagIds.length > 0
    ) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deleteProduct) => {
      res.json(deleteProduct); // Fix typo here
    })
    .catch((err) => res.json(err));
});

module.exports = router;
